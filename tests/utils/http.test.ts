import AxiosMockAdapter from 'axios-mock-adapter'

import StoriesService from '@sx/stories/stories-service'
import {BASE_URL, createHttpClient, defaultHttpClient, normalizeNext} from '@sx/utils/http'


describe('createHttpClient', () => {
  it('authenticates requests and resolves relative paths against the base URL', async () => {
    const http = createHttpClient('a-token')
    const mock = new AxiosMockAdapter(http)
    mock.onGet('/stories/1').reply(200, {id: 1})

    await http.get('/stories/1')

    expect(mock.history.get[0].headers?.['Shortcut-Token']).toEqual('a-token')
    expect(mock.history.get[0].headers?.['Content-Type']).toEqual('application/json')
    expect(http.defaults.baseURL).toEqual(BASE_URL)
  })

  it('isolates clients built with different keys', async () => {
    const a = createHttpClient('key-a')
    const b = createHttpClient('key-b')
    const mockA = new AxiosMockAdapter(a)
    const mockB = new AxiosMockAdapter(b)
    mockA.onGet('/x').reply(200, {})
    mockB.onGet('/x').reply(200, {})

    await a.get('/x')
    await b.get('/x')

    expect(mockA.history.get[0].headers?.['Shortcut-Token']).toEqual('key-a')
    expect(mockB.history.get[0].headers?.['Shortcut-Token']).toEqual('key-b')
  })
})

describe('defaultHttpClient', () => {
  const originalKey = process.env.SHORTCUT_API_KEY

  afterEach(() => {
    process.env.SHORTCUT_API_KEY = originalKey
  })

  it('reads the environment variable without writing it', () => {
    process.env.SHORTCUT_API_KEY = 'env-token'

    const http = defaultHttpClient()

    expect(http.defaults.headers['Shortcut-Token']).toEqual('env-token')
    expect(process.env.SHORTCUT_API_KEY).toEqual('env-token')
  })

  it('throws when the environment variable is not set', () => {
    delete process.env.SHORTCUT_API_KEY

    expect(() => defaultHttpClient()).toThrow('Shortcut API Key not found')
  })
})

describe('normalizeNext', () => {
  it('strips the version prefix so it is not duplicated against the base URL', () => {
    expect(normalizeNext('/api/v3/search/stories?query=q')).toEqual('/search/stories?query=q')
  })

  it('leaves absolute URLs untouched', () => {
    const absolute = 'https://api.app.shortcut.com/api/v3/search/stories?query=q'
    expect(normalizeNext(absolute)).toEqual(absolute)
  })

  it('leaves paths without the version prefix untouched', () => {
    expect(normalizeNext('/search/stories?query=q')).toEqual('/search/stories?query=q')
  })
})

describe('search pagination', () => {
  it('requests the next page without duplicating the version prefix', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onGet(/.*/).reply(200, {
      query: 'q',
      next: '/api/v3/search/stories?query=q&next=page2',
      data: []
    })
    const service = new StoriesService({http})

    const firstPage = await service.search('q')
    await firstPage.next()

    const urls = mock.history.get.map(request => `${request.baseURL ?? ''}${request.url}`)
    expect(urls).toEqual([
      'https://api.app.shortcut.com/api/v3/search/stories?query=q',
      'https://api.app.shortcut.com/api/v3/search/stories?query=q&next=page2'
    ])
  })
})
