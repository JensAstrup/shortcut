import { exec } from 'child_process'
import { promisify } from 'util'

import { LinearClient } from '@linear/sdk'
import dotenv from 'dotenv'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'


dotenv.config({ path: '.env.local' })

// Promisify exec
const execPromise = promisify(exec)

interface CommitInfo {
  sha: string
  message: string
  linearIssueId?: string
  description: string
}

type VersionBumpType = 'major' | 'minor' | 'patch'

/**
 * Execute git command and return stdout
 */
async function executeGitCommand(command: string): Promise<string> {
  try {
    const { stdout } = await execPromise(command)
    return stdout.trim()
  }
  catch (error) {
    throw new Error(`Failed to execute git command: ${error instanceof Error ? error.message : String(error)}`)
  }
}

function getLinearClient(): LinearClient {
  const token = process.env.LINEAR_API_TOKEN
  if (!token) {
    throw new Error('LINEAR_API_TOKEN environment variable is not set')
  }
  return new LinearClient({ accessToken: token })
}

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({
    apiKey
  })
}

async function getIssueDetails(issueId: string): Promise<string> {
  try {
    const linearClient = getLinearClient()
    const linearIssue = await linearClient.issue(issueId)
    return linearIssue.description || linearIssue.title
  }
  catch {
    return 'Failed to fetch issue description'
  }
}

/**
 * Extract Linear issue ID from commit message
 * Looks for pattern SHA-<number>
 */
function extractLinearIssueId(commitMessage: string): string | undefined {
  const shaPattern = /SHA-(\d+)/i
  const match = commitMessage.match(shaPattern)
  return match ? match[1] : undefined
}

/**
 * Get commits between develop and main branch
 */
async function getCommitsBetweenBranches(): Promise<CommitInfo[]> {
  await executeGitCommand('git fetch origin main')

  const command = 'git log main..develop --pretty=format:"%H|%s"'
  const output = await executeGitCommand(command)

  if (!output) {
    return []
  }

  const commits = output.split('\n')

  const commitInfoPromises = commits.map(async (commit) => {
    const parts = commit.split('|')
    const sha = parts[0] || 'unknown'
    const messageParts = parts.slice(1)
    const message = messageParts.join('|') || 'No commit message'
    const linearIssueId = extractLinearIssueId(message)

    let description = message
    if (linearIssueId) {
      description = await getIssueDetails(linearIssueId)
    }

    return {
      sha,
      message,
      linearIssueId,
      description
    }
  })

  return Promise.all(commitInfoPromises)
}

/**
 * Check if string is a valid version bump type
 */
function isValidVersionBumpType(type: string): type is VersionBumpType {
  return ['major', 'minor', 'patch'].includes(type)
}

const versionResponseSchema = z.object({
  type: z.enum(['major', 'minor', 'patch'])
})

/**
 * Determine version bump type using OpenAI
 * Using OpenAI Responses API with Zod validation
 */
async function determineVersionBumpType(commits: CommitInfo[]): Promise<VersionBumpType> {
  const openai = getOpenAIClient()

  const descriptions = commits.map(commit => `- ${commit.description}`).join('\n')

  const systemMessage = `You analyze commit changes and determine the appropriate version bump type (major, minor, or patch) following semantic versioning.
  - Major version bump (breaking change): incompatible API changes or substantial user-facing changes.
  - Minor version bump: backward compatible new functionality.
  - Patch version bump: backward compatible bug fixes.
  Your output must be a JSON object with a single field "type" that has a value of "major", "minor", or "patch" based on your analysis.`

  const userMessage = `Based on the following changes, determine if this should be a major, minor, or patch version bump:

${descriptions}`

  try {
    // Using the OpenAI Responses API with Zod schema validation
    const response = await openai.responses.parse({
      model: 'gpt-4o',
      temperature: 0.2, // Lower temperature to make the model more deterministic
      text: {
        format: zodTextFormat(versionResponseSchema, 'version'),
      },
      input: [
        { role: 'system', content: systemMessage },
        { role: 'user', content: userMessage }
      ],
    })

    // Parse the response
    const version = response.output_parsed

    // Check if the response has a valid type value
    if (version?.type && isValidVersionBumpType(version.type)) {
      return version.type
    }

    throw new Error('Invalid version bump type')
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error determining version bump type: ${errorMessage}`)
    return 'patch' // Default to patch on error
  }
}

/**
 * Main function to determine version bump based on commits
 */
async function determineBumpType(): Promise<VersionBumpType> {
  try {
    const commits = await getCommitsBetweenBranches()

    for (const commit of commits) {
      console.info(commit.message)
    }

    if (commits.length === 0) {
      return 'patch'
    }

    const bumpType = await determineVersionBumpType(commits)
    return bumpType
  }
  catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error(`Error in determineBumpType: ${errorMessage}`)
    return 'patch'
  }
}

// For direct execution via CLI
if (require.main === module) {
  determineBumpType()
    .then((bumpType) => {
      // eslint-disable-next-line no-console
      console.log(`\nSuggested version bump: ${bumpType}`)
      process.exit(0)
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Fatal error:', error)
      process.exit(1)
    })
}

export { determineBumpType }
