import axios from 'axios'

import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'
import process from 'process'


jest.mock('axios', () => ({
  get: jest.fn(),
}))

describe('Team', () => {
  let originalToken: string | undefined

  beforeAll(() => {
    originalToken = process.env.SHORTCUT_TOKEN
    process.env.SHORTCUT_TOKEN = 'token'
  })

  afterAll(() => {
    process.env.SHORTCUT_TOKEN = originalToken
  })

  it('should get stories', async () => {
    const team = new Team({id: '1'} as TeamInterface)
    const storiesData = [{id: '1', name: 'Story 1'}, {id: '2', name: 'Story 2'}]
    axios.get = jest.fn().mockResolvedValue({data: {data: storiesData}})

    const stories = await team.getStories()

    expect(stories).toHaveLength(2)
    expect(stories[0].name).toBe('Story 1')
    expect(stories[1].name).toBe('Story 2')
  })
})
