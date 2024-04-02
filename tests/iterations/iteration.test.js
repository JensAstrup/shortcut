import Iteration from '../../src/iterations/iteration'
import Label from '../../src/labels/label'
import Team from '../../src/teams/team'
import TeamsService from '../../src/teams/teams-service'


jest.mock('../../src/utils/headers', () => ({
    getHeaders: jest.fn().mockReturnValue({Authorization: 'Bearer token'})
}))

describe('Iteration class', () => {
    it('should have the correct baseUrl static property', () => {
        expect(Iteration.baseUrl).toBe('https://api.app.shortcut.com/api/v3/iterations')
    })

    it('returns an array of Teams', async () => {
        const team1 = new Team({id: 1, name: 'Team 1'})
        const team2 = new Team({id: 2, name: 'Team 2'})
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
})
