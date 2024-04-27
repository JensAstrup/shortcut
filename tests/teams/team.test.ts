import process from 'process'

import axios from 'axios'

import Member from '@sx/members/member'
import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'

import {handleResponseFailure} from '../../src/utils/handle-response-failure'


jest.mock('axios', () => ({
  get: jest.fn(),
}))
jest.mock('@sx/utils/handle-response-failure')
const mockedHandleResponseFailure = handleResponseFailure as jest.Mock

describe('Team', () => {
  let originalToken: string | undefined

  beforeAll(() => {
    originalToken = process.env.SHORTCUT_TOKEN
    process.env.SHORTCUT_API_KEY = 'token'
  })

  afterAll(() => {
    process.env.SHORTCUT_API_KEY = originalToken
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should get members', async () => {
    const team = new Team({id: '1', memberIds: [1, 2]} as TeamInterface)
    axios.get = jest.fn()
      .mockResolvedValue({data: {id: '1', name: 'Member 1'}, status: 200})
      .mockResolvedValue({data: {id: '2', name: 'Member 2'}, status: 200})

    const members = await team.members

    expect(members).toHaveLength(2)
    expect(members[0]).toBeInstanceOf(Member)
  })

  it('should get stories', async () => {
    const team = new Team({id: '1'} as TeamInterface)
    const storiesData = [{id: '1', name: 'Story 1'}, {id: '2', name: 'Story 2'}]
    axios.get = jest.fn().mockResolvedValue({data: {data: storiesData}, status: 200})

    const stories = await team.getStories()

    expect(stories).toHaveLength(2)
    expect(stories[0].name).toBe('Story 1')
    expect(stories[1].name).toBe('Story 2')
  })

  it('should throw an error if request fails', async () => {
    const team = new Team({id: '1'} as TeamInterface)
    axios.get = jest.fn().mockRejectedValue(new Error('Failed to fetch stories'))

    await expect(team.getStories()).rejects.toThrow('Failed to fetch stories')
    expect(mockedHandleResponseFailure).toHaveBeenCalledTimes(1)
  })
})
