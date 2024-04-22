import axios from 'axios'

import BaseInterface from '../src/base-interface'
import ShortcutResource from '../src/base-resource'
import BaseService, {BaseSearchableService, ServiceOperation} from '../src/base-service'

import mocked = jest.mocked


jest.mock('axios')


interface MockInterface extends BaseInterface {
  id: string
  name: string
}

class MockResource extends ShortcutResource implements MockInterface {
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
    this.factory = (data) => new MockResource(data)
  }
}


describe('MockService', () => {
  let mockService: MockService
  const mockedAxios = mocked(axios)

  beforeEach(() => {
    mockService = new MockService({headers: {Authorization: 'Bearer token'}})
    mockService.availableOperations = ['get', 'list', 'search']
    jest.clearAllMocks()
  })

  it('should get a resource by ID', async () => {
    const mockData = {id: '1', name: 'Test Resource'}
    const mockResponse = {status: 200, data: mockData}
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['get']
    const resource = await mockService.get('1')

    expect(axios.get).toHaveBeenCalledWith(`${mockService.baseUrl}/1`, {headers: mockService.headers})
    expect(resource).toBeInstanceOf(MockResource)
    expect(resource.id).toEqual(mockData.id)
    expect(resource.name).toEqual(mockData.name)
  })

  it('should throw an error if get method is not available on resource', async () => {
    mockService.availableOperations = ['list']
    expect(mockService.get('1')).rejects.toThrow('Operation not supported')
  })

  it('should get multiple resources', async () => {
    const mockData = [{id: '1', name: 'Test Resource 1'}, {id: '2', name: 'Test Resource 2'}]
    const mockResponse = {status: 200, data: mockData}
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['get']
    const resources = await mockService.getMany(['1', '2'])

    expect(resources).toBeInstanceOf(Array)
    expect(resources).toHaveLength(2)
    expect(resources[0]).toBeInstanceOf(MockResource)
    expect(resources[1]).toBeInstanceOf(MockResource)
  })

  it('should list out resources', async () => {
    const mockData = [{id: '1', name: 'Test Resource 1'}, {id: '2', name: 'Test Resource 2'}]
    const mockResponse = {status: 200, data: mockData}
    mockedAxios.get.mockResolvedValue(mockResponse)

    mockService.availableOperations = ['list']
    const resources = await mockService.list()

    expect(mockedAxios.get).toHaveBeenCalledWith(mockService.baseUrl, {headers: mockService.headers})
    expect(resources).toBeInstanceOf(Array)
    expect(resources).toHaveLength(2)
    expect(resources[0]).toBeInstanceOf(MockResource)
    console.log(resources[0])
    expect(resources[0].id).toEqual(mockData[0].id)
    expect(resources[0].name).toEqual(mockData[0].name)
    expect(resources[1]).toBeInstanceOf(MockResource)
    expect(resources[1].id).toEqual(mockData[1].id)
    expect(resources[1].name).toEqual(mockData[1].name)
  })

  it('should throw an error if list method is not available on resource', () => {
    mockService.availableOperations = ['get']
    expect(mockService.list()).rejects.toThrow('Operation not supported')
  })
})

class MockSearchableService extends BaseSearchableService<MockResource, MockInterface> {
  availableOperations: ServiceOperation[] = ['get', 'list', 'search']

  constructor(init: { headers: Record<string, string> }) {
    super(init)
    this.baseUrl = 'https://api.mockservice.com/resources'
    this.factory = (data) => new MockResource(data)
  }
}

describe('BaseSearchableService', () => {
  let mockService: MockSearchableService
  const mockedAxios = mocked(axios)

  beforeEach(() => {
    mockService = new MockSearchableService({headers: {Authorization: 'Bearer token'}})
    mockService.availableOperations = ['search']
    jest.clearAllMocks()
  })

  it('should return an instance of MockResource', async () => {
    const mockData = {id: '1', name: 'Test Resource'}
    const mockResponse = {status: 200, data: {data: [mockData]}}
    mockedAxios.get.mockResolvedValue(mockResponse)

    const resources = await mockService.search('test')

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.app.shortcut.com/api/v3/search/stories?query=test', {headers: mockService.headers})
    expect(resources.results[0]).toBeInstanceOf(MockResource)
  })

  it('should search using next page if token is provided', async () => {
    const mockData = {id: '1', name: 'Test Resource'}
    const mockResponse = {status: 200, data: {data: [mockData], next: 'https://api.app.shortcut.com/api/v3/search/stories?query=test&page=2'}}
    mockedAxios.get.mockResolvedValue(mockResponse)

    const resources = await mockService.search('test', '/token')

    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.app.shortcut.com/token', {headers: mockService.headers})
    expect(resources.results[0]).toBeInstanceOf(MockResource)
  })
})
