import axios from 'axios'
import BaseService from '../src/base-service'
import StoriesService from '../src/stories/stories-service'
import Story from '../src/stories/story'


jest.mock('axios')

function MockResource(data) {
    Object.assign(this, data)
}


class MockService extends BaseService {
    constructor(init) {
        super(init)
        this.baseUrl = 'https://api.mockservice.com/resources'
        this.factory = (data) => new MockResource(data)
    }
}


describe('MockService', () => {
    let mockService

    beforeEach(() => {
        mockService = new MockService({headers: {Authorization: 'Bearer token'}})
        mockService.availableOperations = ['get', 'list', 'search']
        jest.clearAllMocks()
    })

    it('should get a resource by ID', async () => {
        const mockData = {id: '1', name: 'Test Resource'}
        const mockResponse = {status: 200, data: mockData}
        axios.get.mockResolvedValue(mockResponse)

        mockService.availableOperations = ['get']
        const resource = await mockService.get('1')

        expect(axios.get).toHaveBeenCalledWith(`${mockService.baseUrl}/1`, {headers: mockService.headers})
        expect(resource).toBeInstanceOf(MockResource)
        expect(resource).toEqual(mockData)
    })

    it('should throw an error if get method is not available on resource', async () => {
        mockService.availableOperations = ['list']
        expect(mockService.get('1')).rejects.toThrow('Operation not supported')
    })

    it('should get multiple resources', async () => {
        const mockData = [{id: '1', name: 'Test Resource 1'}, {id: '2', name: 'Test Resource 2'}]
        const mockResponse = {status: 200, data: mockData}
        axios.get.mockResolvedValue(mockResponse)

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
        axios.get.mockResolvedValue(mockResponse)

        mockService.availableOperations = ['list']
        const resources = await mockService.list()

        expect(axios.get).toHaveBeenCalledWith(mockService.baseUrl, {headers: mockService.headers})
        expect(resources).toBeInstanceOf(Array)
        expect(resources).toHaveLength(2)
        expect(resources[0]).toBeInstanceOf(MockResource)
        expect(resources[1]).toBeInstanceOf(MockResource)
        expect(resources).toEqual(mockData)
    })

    it('should throw an error if list method is not available on resource', () => {
        mockService.availableOperations = ['get']
        expect(mockService.list()).rejects.toThrow('Operation not supported')
    })
})

describe('BaseSearchableService', () => {
    let mockService

    beforeEach(() => {
        mockService = new StoriesService({headers: {Authorization: 'Bearer token'}})
        mockService.availableOperations = ['search']
        jest.clearAllMocks()
    })

    it('should return an instance of MockResource', async () => {
        const mockData = {id: '1', name: 'Test Resource'}
        const mockResponse = {status: 200, data: {data: [mockData]}}
        axios.get.mockResolvedValue(mockResponse)

        const resources = await mockService.search('test')

        expect(axios.get).toHaveBeenCalledWith(`https://api.app.shortcut.com/api/v3/search/stories?query=test`, {headers: mockService.headers})
        expect(resources[0]).toBeInstanceOf(Story)
    })
})
