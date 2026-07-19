import axios, {AxiosError, AxiosResponse, InternalAxiosRequestConfig} from 'axios'

import BaseInterface from '../src/base-interface'
import BaseResource from '../src/base-resource'
import { BaseSearchableService, BaseService, ServiceOperation } from '../src/base-service'

import mocked = jest.mocked


jest.mock('axios')


interface MockInterface extends BaseInterface {
  id: string
  name: string
}

class MockResource extends BaseResource implements MockInterface {
  constructor(data: MockInterface) {
    super(data)
    Object.assign(this, data)
  }

  id: string
  name: string
}


class MockService extends BaseService<MockResource, MockInterface> {
  availableOperations: ServiceOperation[] = ['get', 'list']

  constructor(init: { headers: Record<string, string> }) {
    super(init)
    this.baseUrl = 'https://api.mockservice.com/resources'
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    this.factory = data => new MockResource(data)
  }
}


describe('MockService', () => {
  let mockService: MockService
  const mockedAxios = mocked(axios)

  beforeEach(() => {
    mockService = new MockService({ headers: { Authorization: 'Bearer token' } })
    mockService.availableOperations = ['get', 'list', 'search']
    jest.clearAllMocks()
  })

  it('should get a resource by ID', async () => {
    const mockData = { id: '1', name: 'Test Resource' }
    const mockResponse = { status: 200, data: mockData }
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['get']
    const resource = await mockService.get('1')

    expect(axios.get).toHaveBeenCalledWith(`${mockService.baseUrl}/1`, { headers: mockService.headers })
    expect(resource).toBeInstanceOf(MockResource)
    expect(resource.id).toEqual(mockData.id)
    expect(resource.name).toEqual(mockData.name)
  })

  it('should throw an error if get method is not available on resource', async () => {
    mockService.availableOperations = ['list']
    await expect(mockService.get('1')).rejects.toThrow('Operation not supported')
  })

  it('should get multiple resources', async () => {
    const mockData = [{ id: '1', name: 'Test Resource 1' }, { id: '2', name: 'Test Resource 2' }]
    const mockResponse = { status: 200, data: mockData }
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['get']
    const resources = await mockService.getMany(['1', '2'])

    expect(resources).toBeInstanceOf(Array)
    expect(resources).toHaveLength(2)
    expect(resources[0]).toBeInstanceOf(MockResource)
    expect(resources[1]).toBeInstanceOf(MockResource)
  })

  it('should list out resources', async () => {
    const mockData = [{ id: '1', name: 'Test Resource 1' }, { id: '2', name: 'Test Resource 2' }]
    const mockResponse = { status: 200, data: mockData }
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['list']
    const resources = await mockService.list()

    expect(mockedAxios.get).toHaveBeenCalledWith(mockService.baseUrl, { headers: mockService.headers })
    expect(resources).toBeInstanceOf(Array)
    expect(resources).toHaveLength(2)
    expect(resources[0]).toBeInstanceOf(MockResource)
    expect(resources[0].id).toEqual(mockData[0].id)
    expect(resources[0].name).toEqual(mockData[0].name)
    expect(resources[1]).toBeInstanceOf(MockResource)
    expect(resources[1].id).toEqual(mockData[1].id)
    expect(resources[1].name).toEqual(mockData[1].name)
  })

  it('should throw an error if list method is not available on resource', async () => {
    mockService.availableOperations = ['get']
    await expect(mockService.list()).rejects.toThrow('Operation not supported')
  })
})

class MockSearchableService extends BaseSearchableService<MockResource, MockInterface> {
  availableOperations: ServiceOperation[] = ['get', 'list', 'search']

  constructor(init: { headers: Record<string, string> }) {
    super(init)
    this.baseUrl = 'https://api.mockservice.com/resources'
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    this.factory = data => new MockResource(data)
  }
}

describe('BaseSearchableService', () => {
  let mockService: MockSearchableService
  const mockedAxios = mocked(axios)

  beforeEach(() => {
    mockService = new MockSearchableService({ headers: { Authorization: 'Bearer token' } })
    mockService.availableOperations = ['search']
    mockService.baseUrl = 'https://api.app.shortcut.com/api/v3/search/mockResources'
    jest.clearAllMocks()
  })

  it('should throw an error if response status is greater than 400', async () => {
    const mockResponse = { status: 400, statusText: 'Bad Request', data: { error: 'some error' } }
    mockedAxios.get.mockResolvedValue(mockResponse)

    await expect(mockService.search('test')).rejects.toThrow('HTTP error 400 (Bad Request) {"error":"some error"}')
  })

  it('should return an instance of MockResource', async () => {
    const mockData = { id: '1', name: 'Test Resource' }
    const mockResponse = { status: 200, data: { data: [mockData] } }
    mockedAxios.get.mockResolvedValue(mockResponse)

    const resources = await mockService.search('test')

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.app.shortcut.com/api/v3/search/mockResources?query=test', { headers: mockService.headers })
    expect(resources.results[0]).toBeInstanceOf(MockResource)
  })

  it('should search using next page if token is provided', async () => {
    const mockData = { id: '1', name: 'Test Resource' }
    const mockResponse = { status: 200, data: { data: [mockData], next: 'https://api.app.shortcut.com/api/v3/search/mockResources?query=test&page=2' } }
    mockedAxios.get.mockResolvedValue(mockResponse)

    const resources = await mockService.search('test', '/token')

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.app.shortcut.com/token', { headers: mockService.headers })
    expect(resources.results[0]).toBeInstanceOf(MockResource)
  })

  // An AxiosError carries the request config, so chaining it as `cause` would hand the API token to
  // any caller that logs the error. The token is stripped before the error is re-thrown.
  it('strips the Shortcut-Token from the chained cause on an AxiosError', async () => {
    const error = new AxiosError('Request failed', '401')
    error.config = {
      headers: {
        'Content-Type': 'application/json',
        'Shortcut-Token': 'super-secret-token'
      }
    } as unknown as InternalAxiosRequestConfig
    error.response = {
      status: 401,
      statusText: 'Unauthorized',
      data: { message: 'Invalid token' }
    } as AxiosResponse
    mockedAxios.get.mockRejectedValue(error)

    const thrown = await mockService.search('test').then(() => null, (e: Error) => e)

    expect(thrown).toBeInstanceOf(Error)
    expect(thrown!.message).toContain('HTTP error 401 (Unauthorized)')
    const cause = thrown!.cause as AxiosError
    expect(cause).toBe(error)
    expect(cause.config?.headers['Shortcut-Token']).toBeUndefined()
    expect(JSON.stringify(cause.config)).not.toContain('super-secret-token')
    // The rest of the config survives, so the error is still useful for debugging.
    expect(cause.config?.headers['Content-Type']).toBe('application/json')
  })

  it('rethrows non-Axios errors unchanged', async () => {
    const error = new Error('boom')
    mockedAxios.get.mockRejectedValue(error)

    await expect(mockService.search('test')).rejects.toBe(error)
  })
})
