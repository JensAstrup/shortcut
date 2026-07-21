import axios, {AxiosInstance} from 'axios'


export const BASE_URL = 'https://api.app.shortcut.com/api/v3'
const VERSION_PATH = '/api/v3'

/**
 * Create a pre-authenticated HTTP client. All request paths are relative to {@link BASE_URL}.
 * @param apiKey - The Shortcut API token to authenticate requests with
 */
function createHttpClient(apiKey: string): AxiosInstance {
  return axios.create({
    baseURL: BASE_URL,
    headers: {
      'Content-Type': 'application/json',
      'Shortcut-Token': apiKey
    }
  })
}

/**
 * Build a client from the `SHORTCUT_API_KEY` environment variable. Used as a fallback for resources
 * that are constructed directly rather than obtained from a {@link Client}.
 *
 * The environment variable is only ever read, never written.
 *
 * @throws {Error} - If `SHORTCUT_API_KEY` is not set
 */
function defaultHttpClient(): AxiosInstance {
  const apiKey = process.env.SHORTCUT_API_KEY
  if (!apiKey) throw new Error('Shortcut API Key not found')
  return createHttpClient(apiKey)
}

/**
 * Normalize a pagination token from the API into a URL usable with a client bound to
 * {@link BASE_URL}. The API returns `next` as an absolute path that already includes the version
 * prefix (`/api/v3/search/stories?...`), which would otherwise be appended to the base URL and
 * produce `/api/v3/api/v3/...`.
 *
 * Fully qualified URLs are passed through untouched — axios ignores `baseURL` for those.
 *
 * @param next - The `next` value returned by a search response
 */
function normalizeNext(next: string): string {
  if (next.startsWith('http://') || next.startsWith('https://')) return next
  return next.startsWith(VERSION_PATH) ? next.slice(VERSION_PATH.length) : next
}

export { createHttpClient, defaultHttpClient, normalizeNext }

