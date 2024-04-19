import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import {convertApiFields} from '@sx/utils/convert-fields'

import StoriesService from '../../src/stories/stories-service'
import Story from '../../src/stories/story'


const axiosMock = new AxiosMockAdapter(axios)
jest.mock('../../src/utils/convert-fields', () => {
  return {
    convertApiFields: jest.fn().mockImplementation((fields) => fields)
  }
})


describe('Stories service', () => {
  beforeEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })

  it('should construct a new instance', () => {
    const service = new StoriesService({headers: {Authorization: 'Bearer token'}})
    expect(service.headers).toEqual({Authorization: 'Bearer token'})
  })

  it('should return an array of stories after searching', async () => {
    axiosMock.onGet().reply(200, {
      data: [{id: 1, name: 'Story 1', created_at: '2021-01-01T00:00:00Z'},
        {id: 2, name: 'Story 2', created_at: '2021-01-02T00:00:00Z'}]
    })
    // Create expected Stories using the Story constructor to mimic the actual transformation
    const expectedStories = [
      new Story({id: 1, name: 'Story 1', created_at: '2021-01-01T00:00:00Z'}),
      new Story({id: 2, name: 'Story 2', created_at: '2021-01-02T00:00:00Z'})
    ]
    const service = new StoriesService({headers: {}})
    const stories = await service.search('story')

    // Since we're comparing instances of Story, either ensure Story's equality check is appropriate
    // or compare based on a property that should be equal, like IDs or names.
    expectedStories.forEach((expectedStory, index) => {
      expect(stories.results[index]).toEqual(expect.objectContaining({
        id: expectedStory.id,
        name: expectedStory.name
      }))
    })

    expect(convertApiFields).toHaveBeenCalledTimes(2)
  })

  it('should return an array of stories with external links', async () => {
    axiosMock.onGet().reply(200, [
      {id: 1, name: 'Story 1', created_at: '2021-01-01T00:00:00Z'},
      {id: 2, name: 'Story 2', created_at: '2021-01-02T00:00:00Z'}
    ])
    const service = new StoriesService({headers: {}})
    const stories = await service.getExternallyLinked('http://example.com')

    expect(stories).toHaveLength(2)
    expect(convertApiFields).toHaveBeenCalledTimes(2)
    expect(stories[0]).toBeInstanceOf(Story)
    expect(stories[1]).toBeInstanceOf(Story)
    expect(stories[0].id).toEqual(1)
    expect(stories[1].id).toEqual(2)
  })
})
