import axios from 'axios'
import IterationsService from '../../src/iterations/iterations-service'
import Iteration from '../../src/iterations/iteration'


jest.mock('axios')

describe('IterationsService', () => {
    let iterationsService

    beforeEach(() => {
        iterationsService = new IterationsService({headers: {'Content-Type': 'application/json', 'Shortcut-Token': 'token'}})
        jest.clearAllMocks() // Clears the mock call history before each test
    })

    it('should create an iteration successfully', async () => {
        const mockIterationData = {
            name: 'Test Iteration',
            startDate: '2023-01-01',
            endDate: '2023-01-07',
            labels: []
        }
        const mockResponse = {status: 200, data: {...mockIterationData, id: 123}}
        axios.post.mockResolvedValue(mockResponse)

        const result = await iterationsService.create(mockIterationData)

        expect(axios.post).toHaveBeenCalledWith(iterationsService.baseUrl, mockIterationData, {headers: iterationsService.headers})
        expect(result).toBeInstanceOf(Iteration)
        expect(result.id).toBe(123)
    })

    it('should throw an error when the response status is 400 or above', async () => {
        const mockIterationData = {
            name: 'Test Iteration',
            startDate: '2023-01-01',
            endDate: '2023-01-07',
            labels: []
        }
        const mockErrorResponse = {status: 400}
        axios.post.mockResolvedValue(mockErrorResponse)

        await expect(iterationsService.create(mockIterationData)).rejects.toThrow('HTTP error 400')

        expect(axios.post).toHaveBeenCalledWith(iterationsService.baseUrl, mockIterationData, {headers: iterationsService.headers})
    })

    // Additional tests can be written to cover other methods and edge cases
})
