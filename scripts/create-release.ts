import { config } from 'dotenv'
import { execa } from 'execa'
import type { Octokit } from 'octokit'
import OpenAI from 'openai'
import ora from 'ora'

import { getNewVersion } from './utils/get-new-version'
import { getOctokit, getRepo } from './utils/github'


config({ path: '.env.local' })

const SYSTEM_PROMPT = `
You write the release notes for new versions of a software product.

You are given a list of GitHub issues that have been closed in the current release. Each entry starts with the
issue number (prefixed with #), followed by the title and then the description.

You should take the title and description of each issue and write a concise summary of the changes made.

Always use the issue number you were given — never invent one.

The release notes should be in the following format:

## v1.0.0
- [Issue Description] (Closes #[ISSUE-ID])

------
Example:

Input:
New version: v1.0.0
---
#205 Display profile information
Each user should see a button that opens their "profile information", consisting of a non-functional form for changing their display name.
---
#212 Allow anonymous users to set name
Anonymous users should be able to set their display name
---
#228 Create changelog page
There is a static page which provides a comprehensive overview of GitHub releases. It consists of a list for each release, detailing any changes such as dependency updates, even if no new features are introduced. The page is back-populated with releases to ensure a complete history is available.

Acceptance Criteria:

A dedicated page is accessible from the footer displaying a list of all GitHub releases.

Each release entry includes a description of the changes made, such as dependency updates or bug fixes.

The app is capable of back-populating releases to include historical data. 

The release information is accurate and up-to-date with the GitHub repository.

The page is user-friendly, with clear navigation and formatting for easy readability.

The difference between this comprehensive coverage of each release and the current changelog is clear

------
Output:
## v1.0.0
- Display modal for updating profile information (Closes #205)
- Create changelog page (Closes #228)
`

type IssueContent = {
  number: number
  title: string
  description?: string
}

type GitHubIssue = {
  number: number
  title: string
  body?: string | null
  closed_at?: string | null
  pull_request?: unknown
}

/**
 * Returns the publish date of the latest GitHub release, if there is one
 */
async function getLastReleaseDate(octokit: Octokit): Promise<string | undefined> {
  try {
    const release = await octokit.rest.repos.getLatestRelease(getRepo())
    return release.data.published_at ?? release.data.created_at
  }
  catch {
    // No releases yet — include every closed issue
    return undefined
  }
}

/**
 * Fetches issues from GitHub that have been closed since the last release
 */
async function getIssues(): Promise<GitHubIssue[]> {
  const octokit = getOctokit()
  const since = await getLastReleaseDate(octokit)
  const issues = await octokit.paginate(octokit.rest.issues.listForRepo, {
    ...getRepo(),
    state: 'closed',
    per_page: 100,
    ...(since ? { since } : {}),
  })
  // The issues endpoint also returns pull requests; drop them
  const closedIssues = issues.filter((issue: GitHubIssue) => !issue.pull_request)
  if (!since) {
    return closedIssues
  }
  // `since` filters on updated_at, so drop issues that were closed before the last release
  const sinceTime = new Date(since).getTime()
  return closedIssues.filter((issue: GitHubIssue) => !!issue.closed_at && new Date(issue.closed_at).getTime() >= sinceTime)
}

/**
 * Extracts content from a GitHub issue
 */
function getIssueContent(issue: GitHubIssue): IssueContent {
  return {
    number: issue.number,
    title: issue.title,
    description: issue.body ?? undefined,
  }
}

/**
 * Formats issues for AI notes generation
 */
function getIssueNotes(issues: IssueContent[]): string {
  let issueNotes = ''
  for (const issue of issues) {
    issueNotes += `
    ---
    #${issue.number} ${issue.title}
    ${issue.description}
    ---
    `
  }
  return issueNotes
}

/**
 * Generates release notes using OpenAI
 */
async function retrieveNotes(issues: IssueContent[], newVersion: string): Promise<string> {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY!,
  })
  const systemMessage: OpenAI.ChatCompletionSystemMessageParam = {
    content: SYSTEM_PROMPT,
    role: 'system',
  }
  const userMessage: OpenAI.ChatCompletionUserMessageParam = {
    content: `New version: ${newVersion}\n\n------\n\n${getIssueNotes(issues)}`,
    role: 'user',
  }
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [systemMessage, userMessage],
  })
  if (!response.choices[0]) {
    throw new Error('retrieveNotes: No response from OpenAI')
  }
  const notes = response.choices[0].message.content
  if (!notes) {
    throw new Error('retrieveNotes: No notes from OpenAI')
  }
  return notes
}

/**
 * Creates a GitHub PR from develop to main with release notes
 */
async function createPullRequest(notes: string, version: string): Promise<string> {
  const octokit = getOctokit()
  const pullRequest = await octokit.rest.pulls.create({
    ...getRepo(),
    title: `${version}`,
    body: notes,
    head: 'develop',
    base: 'main',
  })
  return pullRequest.data.html_url
}

async function updateDevelopBranch(): Promise<void> {
  await execa('git', ['checkout', 'develop'])
  await execa('git', ['pull', 'origin', 'develop'])
}

/**
 * Main function to create a release
 */
async function createRelease(): Promise<void> {
  const spinner = ora('Starting release process').start()

  try {
    spinner.text = 'Updating develop branch'
    await updateDevelopBranch()

    spinner.text = 'Fetching issues from GitHub'
    const issues = await getIssues()
    const issueContents = issues.map(getIssueContent)

    const newVersion = await getNewVersion()

    spinner.text = 'Generating release notes with AI'
    const notes = await retrieveNotes(issueContents, newVersion)

    spinner.text = 'Creating pull request'
    const pullRequestUrl = await createPullRequest(notes, newVersion)

    spinner.succeed(`Release PR created: ${pullRequestUrl}`)
  }
  catch (error) {
    spinner.fail(error instanceof Error ? error.message : 'Unknown error occurred')
    throw error
  }
}

// Execute if called directly
if (require.main === module) {
  createRelease().catch(() => process.exit(1))
}

export { createRelease, getIssues, getIssueContent, retrieveNotes, createPullRequest }
