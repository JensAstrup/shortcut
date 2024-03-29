import axios from 'axios'
import Epic from '../../src/epics/epic'
import {convertApiFields} from '../../src/utils/convert-fields'
import {getHeaders} from '../../src/utils/headers'


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}))

describe('Epic', () => {
    process.env.SHORTCUT_API_KEY = 'token'
    beforeEach(() => {
        axios.post.mockClear()
    })

    describe('comment method', () => {
        it('successfully posts a comment and returns the epic comment object', async () => {
            const commentData = {text: 'Test comment'}
            const expectedResponse = {data: commentData}
            axios.post.mockResolvedValue(expectedResponse)

            const epic = new Epic({id: 1})
            const result = await epic.comment('Test comment')

            expect(result).toEqual(convertApiFields(commentData))
            expect(axios.post).toHaveBeenCalledWith(`${Epic.baseUrl}/${epic.id}/comments`, {text: 'Test comment'}, {headers: getHeaders()})
        })

        it('throws an error if the axios request fails', async () => {
            axios.post.mockRejectedValue(new Error('Network error'))
            const epic = new Epic({id: 1})

            await expect(epic.comment('Test comment')).rejects.toThrow('Error creating comment: Error: Network error')
        })
    })

    describe('addComment method', () => {
        it('successfully posts a comment and returns the epic comment object', async () => {
            const commentData = {text: 'Test comment'}
            const expectedResponse = {data: commentData}
            axios.post.mockResolvedValue(expectedResponse)

            const epic = new Epic({id: 1})
            const comment = {
                text: 'Test comment',
                authorId: '123',
                createdAt: null,
                externalId: null,
                updatedAt: null
            }
            const result = await epic.addComment(comment)

            expect(result).toEqual(convertApiFields(commentData))
            expect(axios.post).toHaveBeenCalledWith(`${Epic.baseUrl}/${epic.id}/comments`, {
                text: 'Test comment',
                author_id: '123',
                created_at: null,
                external_id: null,
                updated_at: null
            }, {headers: getHeaders()})

        })

        it('throws an error if the axios request fails', async () => {
            axios.post.mockRejectedValue(new Error('Network error'))
            const epic = new Epic({id: 1})
            const comment = {
                text: 'Test comment',
                authorId: '123',
                createdAt: null,
                externalId: null,
                updatedAt: null
            }

            await expect(epic.addComment(comment)).rejects.toThrow('Error creating comment: Error: Network error')
        })
    })
})