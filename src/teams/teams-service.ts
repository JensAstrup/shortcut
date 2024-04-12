import axios from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'


export default class TeamsService extends BaseService<Team, TeamInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/groups'
  protected factory = (data: TeamInterface) => new Team(data)
  public static teams: Record<number, Team> = {}
  public availableOperations: ServiceOperation[] = ['get', 'list']

  /**
   * Enables the teams feature for the workspace.
   */
  public async enable(): Promise<boolean> {
    await axios.post(`${this.baseUrl}/enable`, {}, {headers: this.headers})
    return true
  }

  /**
   * Disables the teams feature for the workspace.
   */
  public async disable(): Promise<boolean> {
    await axios.post(`${this.baseUrl}/disable`, {}, {headers: this.headers})
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
