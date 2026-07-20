import { exec } from 'child_process'
import { promisify } from 'util'

import dotenv from 'dotenv'
import OpenAI from 'openai'
import { zodTextFormat } from 'openai/helpers/zod'
import { z } from 'zod'

import { getOctokit, getRepo } from './github'


dotenv.config({ path: '.env.local' })

// Promisify exec
const execPromise = promisify(exec)

interface CommitInfo {
  sha: string
  message: string
  issueNumber?: number
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

function getOpenAIClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY environment variable is not set')
  }
  return new OpenAI({
    apiKey
  })
}

/**
 * Fetches the body (or title, if the body is empty) of a GitHub issue or pull request
 */
async function getIssueDetails(issueNumber: number): Promise<string> {
  try {
    const octokit = getOctokit()
    const issue = await octokit.rest.issues.get({
      ...getRepo(),
      issue_number: issueNumber,
    })
    return issue.data.body || issue.data.title
  }
  catch {
    return 'Failed to fetch issue description'
  }
}

/**
 * Extract a GitHub issue number from a commit message
 * The number is a bare leading value, e.g. "326 Inject axios instance (#335)"
 */
function extractIssueNumber(commitMessage: string): number | undefined {
  const issuePattern = /^(\d+)\b/
  const match = commitMessage.match(issuePattern)
  return match?.[1] ? Number(match[1]) : undefined
}

/**
 * Get commits between develop and main branch
 */
async function getCommitsBetweenBranches(): Promise<CommitInfo[]> {
  await executeGitCommand('git fetch origin main develop')

  const command = 'git log origin/main..origin/develop --pretty=format:"%H|%s"'
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
    const issueNumber = extractIssueNumber(message)

    let description = message
    if (issueNumber) {
      description = await getIssueDetails(issueNumber)
    }

    return {
      sha,
      message,
      issueNumber,
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
      // eslint-disable-next-line no-console
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
