import BaseService, {ServiceOperation} from '@sx/base-service'
import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'


class TeamsService extends BaseService<Team, TeamInterface> {
  public baseUrl = '/groups'
  protected factory = (data: TeamInterface): Team => new Team(data)
  public static teams: Record<number, Team> = {}
  public availableOperations: ServiceOperation[] = ['get', 'list']

  /**
   * Enables the teams feature for the workspace.
   */
  public async enable(): Promise<boolean> {
    await this.http.post(`${this.baseUrl}/enable`, {})
    return true
  }

  /**
   * Disables the teams feature for the workspace.
   */
  public async disable(): Promise<boolean> {
    await this.http.post(`${this.baseUrl}/disable`, {})
    return true
  }

  /**
   * A convenience method to get a team by name instead of by ID. Search is case-sensitive.
   * @param name
   */
  public async getByName(name: string): Promise<Team | null> {
    const teams: Array<Team> = await this.list()
    return teams.find((team: Team): boolean => team.name === name) ?? null
  }

}

export { TeamsService as default }

