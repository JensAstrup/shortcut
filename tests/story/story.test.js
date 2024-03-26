import axios from 'axios'
import {Story} from '@sx/stories/stories'
import {convertApiFields} from '../../src/utils/convert-fields'
import {getHeaders} from '../../src/utils/headers'


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}))
// Mock WorkflowService, IterationsService, getHeaders, convertApiFields as necessary

describe('Story', () => {
    process.env.SHORTCUT_API_KEY = 'token'
    beforeEach(() => {
        // Reset mocks and any setup before each test
        axios.post.mockClear()
    })

    describe('workflow getter', () => {
        it('should return workflow state by ID', () => {
            // Mock WorkflowService.getWorkflowState to return a specific workflow state
            // Test the workflow getter
        })
    })

    describe('iteration getter', () => {
        it('throws an error if story does not have an iteration', async () => {
            const story = new Story({iterationId: null}) // Adjust initial data as needed
            await expect(async () => story.iteration).rejects.toThrow('Story does not have an iteration')
        })

        it('returns an iteration if story has an iteration ID', async () => {
            // Mock IterationsService.get to return a specific iteration
            // Test the iteration getter for a valid case
        })
    })

    describe('comment method', () => {
        it('successfully posts a comment and returns the story comment object', async () => {
            const commentData = {text: 'Test comment'}
            const expectedResponse = {data: commentData}
            axios.post.mockResolvedValue(expectedResponse)
            // Mock convertApiFields to return a camelCase version of the data

            const story = new Story({id: 1}) // Adjust initial data as needed
            const result = await story.comment('Test comment')

            expect(result).toEqual(convertApiFields(commentData))
            expect(axios.post).toHaveBeenCalledWith(`${Story.baseUrl}/stories/${story.id}/comments`, {text: 'Test comment'}, {headers: getHeaders()})
        })

        it('throws an error if the axios request fails', async () => {
            axios.post.mockRejectedValue(new Error('Network error'))
            const story = new Story({id: 1}) // Adjust initial data as needed

            await expect(story.comment('Test comment')).rejects.toThrow('Error creating comment: Error: Network error')
        })
    })
})
