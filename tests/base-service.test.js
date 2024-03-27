import axios from 'axios'
import BaseService from '../src/base-service'


jest.mock('axios');


function MockResource(data) {
    Object.assign(this, data);
}


class MockService extends BaseService {
    constructor(init) {
        super(init);
        this.baseUrl = 'https://api.mockservice.com/resources';
        this.factory = (data) => new MockResource(data);
    }
}

describe('MockService', () => {
    let mockService;

    beforeEach(() => {
        mockService = new MockService({ headers: { Authorization: 'Bearer token' } });
        jest.clearAllMocks();
    });

    it('should get a resource by ID', async () => {
        const mockData = { id: '1', name: 'Test Resource' };
        const mockResponse = { status: 200, data: mockData };
        axios.get.mockResolvedValue(mockResponse);

        const resource = await mockService.get('1');

        expect(axios.get).toHaveBeenCalledWith(`${mockService.baseUrl}/1`, { headers: mockService.headers });
        expect(resource).toBeInstanceOf(MockResource);
        expect(resource).toEqual(mockData);
    });

    // Similar structure for other tests
});
