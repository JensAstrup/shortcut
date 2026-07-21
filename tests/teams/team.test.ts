import process from 'process'

import Member from '@sx/members/member'
import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'

import {handleResponseFailure} from '../../src/utils/handle-response-failure'
import {stubHttp} from '../helpers/http'


jest.mock('@sx/utils/handle-response-failure')
const mockedHandleResponseFailure = handleResponseFailure as jest.Mock

describe('Team', () => {
  let originalApiKey: string | undefined

  beforeAll(() => {
    originalApiKey = process.env.SHORTCUT_API_KEY
    process.env.SHORTCUT_API_KEY = 'token'
  })

  afterAll(() => {
    process.env.SHORTCUT_API_KEY = originalApiKey
    jest.clearAllMocks()
    jest.restoreAllMocks()
  })

  it('should get members', async () => {
    const http = stubHttp()
    const team = new Team({id: '1', memberIds: [1, 2]} as TeamInterface).setHttp(http);
    (http.get as jest.Mock)
      .mockResolvedValue({data: {id: '1', name: 'Member 1'}, status: 200})
      .mockResolvedValue({data: {id: '2', name: 'Member 2'}, status: 200})

    const members = await team.members

    expect(members).toHaveLength(2)
    expect(members[0]).toBeInstanceOf(Member)
  })

  it('should get stories', async () => {
    const http = stubHttp()
    const team = new Team({id: '1'} as TeamInterface).setHttp(http)
    const storiesData = [{id: '1', name: 'Story 1'}, {id: '2', name: 'Story 2'}];
    (http.get as jest.Mock).mockResolvedValue({data: {data: storiesData}, status: 200})

    const stories = await team.getStories()

    expect(stories).toHaveLength(2)
    expect(stories[0].name).toBe('Story 1')
    expect(stories[1].name).toBe('Story 2')
  })

  it('should throw an error if request fails', async () => {
    const http = stubHttp()
    const team = new Team({id: '1'} as TeamInterface).setHttp(http);
    (http.get as jest.Mock).mockRejectedValue(new Error('Failed to fetch stories'))

    await expect(team.getStories()).rejects.toThrow('Failed to fetch stories')
    expect(mockedHandleResponseFailure).toHaveBeenCalledTimes(1)
  })
})
