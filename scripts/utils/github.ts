import { Octokit } from 'octokit'


/**
 * Creates an authenticated Octokit client
 */
function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new Error('GITHUB_TOKEN environment variable is not set')
  }
  return new Octokit({ auth: token })
}

/**
 * Resolves the target repository from the environment
 */
function getRepo(): { owner: string, repo: string } {
  const owner = process.env.GITHUB_REPO_OWNER
  const repo = process.env.GITHUB_REPO_NAME
  if (!owner || !repo) {
    throw new Error('GITHUB_REPO_OWNER and GITHUB_REPO_NAME environment variables must be set')
  }
  return { owner, repo }
}

export { getOctokit, getRepo }
