import { AxiosInstance } from 'axios'

import Iteration from '@sx/iterations/iteration'
import Label from '@sx/labels/label'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'

import { stubHttp } from '../helpers/http'


describe('Iteration class', () => {
  it('should have the correct baseUrl static property', () => {
    expect(Iteration.baseUrl).toBe('/iterations')
  })

  it('returns an array of Teams', async () => {
    const team1 = new Team({id: '1', name: 'Team 1'} as unknown as Team)
    const team2 = new Team({id: '2', name: 'Team 2'} as unknown as Team)
    jest.spyOn(TeamsService.prototype, 'getMany').mockResolvedValue([team1, team2])
    const iteration = new Iteration({groupIds: [1, 2]})
    const teams = await iteration.teams
    expect(teams).toEqual([team1, team2])
  })

  it('should properly initialize with given properties', () => {
    const mockInitObject = {
      appUrl: 'https://app.shortcut.com/iteration/123',
      createdAt: new Date(),
      endDate: '2023-12-31',
      entityType: 'iteration',
      followerIds: ['f1', 'f2'],
      groupIds: ['g1', 'g2'],
      groupMentionIds: ['gm1', 'gm2'],
      id: 123,
      labelIds: [1, 2],
      labels: [new Label({id: 1}), new Label({id: 2})],
      memberMentionIds: ['mm1', 'mm2'],
      mentionIds: ['m1', 'm2'],
      name: 'Iteration 1',
      startDate: new Date(),
      status: 'started',
      updatedAt: new Date()
    }

    const iteration = new Iteration(mockInitObject)

    Object.entries(mockInitObject).forEach(([key, value]) => {
      expect(iteration[key]).toEqual(value)
    })
  })

  it('should have createFields static array with specific fields', () => {
    const expectedFields = ['name', 'startDate', 'endDate', 'labels']
    const iteration = new Iteration({})
    expect(iteration.createFields).toEqual(expect.arrayContaining(expectedFields))
    expect(iteration.createFields.length).toBe(expectedFields.length)
  })

  it('sends start_date and end_date as date-only strings on create', async () => {
    const http: AxiosInstance = stubHttp()
    const post = http.post as jest.Mock
    post.mockResolvedValue({data: {id: 1}})
    const startDate = new Date('2026-07-29T12:31:07.768Z')
    const endDate = new Date('2026-08-05T12:31:07.768Z')
    const iteration = new Iteration({name: 'Iteration 1', startDate, endDate}).setHttp(http)

    await iteration.save()

    const [, body] = post.mock.calls[0] as [string, { start_date: string; end_date: string }]
    expect(body.start_date).toBe('2026-07-29')
    expect(body.end_date).toBe('2026-08-05')
  })
})
