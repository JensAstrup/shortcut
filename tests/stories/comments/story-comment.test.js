import axios from 'axios'
import StoryComment from '../../../src/stories/comment/story-comment'


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}))

jest.mock('../../../src/utils/headers', () => ({
    getHeaders: jest.fn().mockReturnValue({Authorization: 'Bearer token'})
}))

describe('Story Comment', () => {
    beforeEach(() => {
        axios.post.mockClear()
    })
    it('should add reaction to comment', () => {
        axios.post.mockResolvedValue({data: {}})
        const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'})
        comment.react(':thumbsup:')
        const expectedUrl = 'https://api.app.shortcut.com/api/v3/stories/10/comments/1/reactions'
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, {emoji: ':thumbsup:'}, {headers: {Authorization: 'Bearer token'}})
    })

    it('should throw error if request fails when reacting', async () => {
        axios.post.mockRejectedValue(new Error('Request failed'))
        const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'})
        await expect(async () => comment.react(':thumbsup:')).rejects.toThrow('Error reacting to comment: Error: Request failed')
    })

    it('should add comment', () => {
        axios.post.mockResolvedValue({data: {}})
        const comment = new StoryComment({storyId: 10, text: 'Test comment', id: 1})
        comment.comment('Test comment')
        const expectedUrl = 'https://api.app.shortcut.com/api/v3/stories/10/comments'
        expect(axios.post).toHaveBeenCalledWith(expectedUrl, {
            text: 'Test comment',
            parentId: 1
        }, {headers: {Authorization: 'Bearer token'}})
    })

    it('should throw error if request fails when commenting', async () => {
        axios.post.mockRejectedValue(new Error('Request failed'))
        const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'})
        await expect(async () => comment.comment('test')).rejects.toThrow('Error creating comment: Error: Request failed')
    })
})
