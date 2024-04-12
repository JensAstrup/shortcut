import Member from '@sx/members/member'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'


describe('Member', () => {
  it('should construct a new member instance on instantiation', () => {
    const member = new Member({id: 'UUID1', name: 'Test Member'})
    expect(member.id).toBe('UUID1')
    expect(member.name).toBe('Test Member')
  })

  it('should return teams for a member', async () => {
    const teamData  = [{id: 'UUID1', name: 'Test Team 1'}, {id: 'UUID2', name: 'Test Team 2'}]
    jest.spyOn(TeamsService.prototype, 'getMany').mockResolvedValue(teamData as Team[])
    const member = new Member({id: 'UUID1', name: 'Test Member'})
    const teams = await member.teams
    expect(teams).toHaveLength(2)
    expect(teams[0].name).toBe('Test Team 1')
  })
})
