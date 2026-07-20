/* eslint-disable no-console */
import { config } from 'dotenv'
import { execa } from 'execa'
import { Octokit } from 'octokit'
import ora, { Ora } from 'ora'

import { getNewVersion } from './utils/get-new-version'


config({ path: '.env.local' })

/**
 * Creates a new branch for version bump and pushes it
 */
async function bumpVersion(versionType: string): Promise<string> {
  const { stdout: status } = await execa('git', ['status', '--porcelain'])
  if (status) {
    throw new Error('bumpVersion: Working directory is not clean. Please commit or stash changes.')
  }

  // Create version branch from develop
  await execa('git', ['fetch', 'origin', 'develop'])
  await execa('git', ['checkout', 'develop'])
  await execa('git', ['pull', 'origin', 'develop'])

  // Get the new version before creating the branch
  await execa('yarn', ['version', versionType])
  const version = await getNewVersion()
  const versionBranch = `v${version}`

  // Delete local branch if it exists
  try {
    await execa('git', ['branch', '-D', versionBranch])
  }
  catch {
    // Branch doesn't exist locally, continue
  }

  // Check if branch exists remotely and delete it
  try {
    const { stdout } = await execa('git', ['ls-remote', '--heads', 'origin', versionBranch])
    if (stdout) {
      // Branch exists, delete it remotely
      await execa('git', ['push', 'origin', '--delete', versionBranch])
    }
  }
  catch {
    // Branch doesn't exist or error checking, continue
  }

  // Create new branch and commit version bump
  await execa('git', ['checkout', '-b', versionBranch])
  await execa('git', ['add', 'package.json'])
  await execa('git', ['commit', '-m', `Bump version to ${version}`])
  await execa('git', ['push', 'origin', versionBranch])

  return version
}

/**
 * Creates a PR for the version bump
 */
async function createVersionPullRequest(version: string, spinner: Ora): Promise<string> {
  spinner.text = `Creating PR for version ${version} in ${process.env.GITHUB_REPO_OWNER}/${process.env.GITHUB_REPO_NAME}`
  const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN!,
  })
  const repo = process.env.GITHUB_REPO_NAME!
  const pullRequest = await octokit.rest.pulls.create({
    owner: process.env.GITHUB_REPO_OWNER!,
    repo,
    title: `Bump version to ${version}`,
    body: `Version bump to ${version}`,
    head: `v${version}`,
    base: 'develop',
  })
  return pullRequest.data.html_url
}

/**
 * Main function to prepare a version bump
 */
async function prepareVersion(versionType: 'major' | 'minor' | 'patch'): Promise<void> {
  if (!['major', 'minor', 'patch'].includes(versionType)) {
    process.stderr.write('Version type must be one of: major, minor, patch\n')
    process.exit(1)
  }

  const spinner = ora('Starting version bump process').start()

  try {
    spinner.text = 'Creating version branch'
    const version = await bumpVersion(versionType)

    spinner.text = 'Creating pull request to develop'
    const pullRequestUrl = await createVersionPullRequest(version, spinner)

    spinner.succeed(`Version bump PR created: ${pullRequestUrl}`)
  }
  catch (error) {
    spinner.fail(error instanceof Error ? error.message : 'Unknown error occurred')
    process.exit(1)
  }
}

export {
  prepareVersion,
  bumpVersion,
  createVersionPullRequest
}
