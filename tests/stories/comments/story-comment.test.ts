import {AxiosInstance} from 'axios'

import StoryComment from '../../../src/stories/comment/story-comment'
import {stubHttp} from '../../helpers/http'


describe('Story Comment', () => {
  let http: AxiosInstance

  beforeEach(() => {
    http = stubHttp()
  })

  it('should add reaction to comment', async () => {
    (http.post as jest.Mock).mockResolvedValue({data: {}})
    const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'}).setHttp(http)
    await comment.react(':thumbsup:')
    const expectedUrl = '/stories/10/comments/1/reactions'
    expect(http.post).toHaveBeenCalledWith(expectedUrl, {emoji: ':thumbsup:'})
  })

  it('should throw error if request fails when reacting', async () => {
    (http.post as jest.Mock).mockRejectedValue(new Error('Request failed'))
    const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'}).setHttp(http)
    await expect(async () => comment.react(':thumbsup:')).rejects.toThrow('Error reacting to comment: Error: Request failed')
  })

  it('should add comment', async () => {
    (http.post as jest.Mock).mockResolvedValue({data: {}})
    const comment = new StoryComment({storyId: 10, text: 'Test comment', id: 1}).setHttp(http)
    await comment.comment('Test comment')
    const expectedUrl = '/stories/10/comments'
    expect(http.post).toHaveBeenCalledWith(expectedUrl, {
      text: 'Test comment',
      parentId: 1
    })
  })

  it('should throw error if request fails when commenting', async () => {
    (http.post as jest.Mock).mockRejectedValue(new Error('Request failed'))
    const comment = new StoryComment({id: 1, storyId: 10, text: 'Test comment'}).setHttp(http)
    await expect(async () => comment.comment('test')).rejects.toThrow('Error creating comment: Error: Request failed')
  })
})
