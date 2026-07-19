import axios, {AxiosInstance} from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import {BASE_URL} from '@sx/utils/http'


/**
 * An HTTP client owned by the test, plus an adapter bound to it.
 *
 * Services and resources now make requests through an injected client rather than the global axios
 * export, so tests mock the instance they hand in. Request paths are relative to {@link BASE_URL},
 * so matchers should use paths (`/stories/1`), not absolute URLs.
 */
export function mockHttp(): {http: AxiosInstance, mock: AxiosMockAdapter} {
  const http = axios.create({baseURL: BASE_URL})
  return {http, mock: new AxiosMockAdapter(http)}
}

/**
 * A bare jest-stubbed client, for tests that assert on call arguments rather than serving responses.
 */
export function stubHttp(): AxiosInstance {
  return {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
  } as unknown as AxiosInstance
}
