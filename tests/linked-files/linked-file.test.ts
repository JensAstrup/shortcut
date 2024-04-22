import LinkedFile from '@sx/linked-files/linked-file'
import StoriesService from '@sx/stories/stories-service'
import Story from '@sx/stories/story'


jest.mock('../../src/utils/headers', () => ({
  getHeaders: jest.fn().mockReturnValue({Authorization: 'Bearer token'})
}))

describe('Linked file', () => {
  it('constructs a linked file', () => {
    const linkedFile = new LinkedFile({
      id: 1,
      type: 'google',
      url: 'https://example.com/file.txt'
    } as unknown as LinkedFile)
    expect(linkedFile).toBeInstanceOf(LinkedFile)
    expect(linkedFile.id).toBe(1)
    expect(linkedFile.type).toBe('google')
    expect(linkedFile.url).toBe('https://example.com/file.txt')
  })

  it('returns an array of relate stories', () => {
    const story1 = new Story({id: 1, name: 'Story 1'})
    const story2 = new Story({id: 2, name: 'Story 2'})
    jest.spyOn(StoriesService.prototype, 'getMany').mockResolvedValue([story1, story2])
    const linkedFile = new LinkedFile({
      id: 1,
      type: 'google',
      url: 'https://example.com/file.txt',
      storyIds: [1, 2]
    } as unknown as LinkedFile)
    expect(linkedFile.stories).resolves.toEqual([story1, story2])
  })
})
