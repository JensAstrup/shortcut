import axios from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import TeamInterface from '@sx/teams/contracts/team-interface'
import Team from '@sx/teams/team'

export default class TeamsService extends BaseService<Team, TeamInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/groups'
    protected factory = (data: TeamInterface) => new Team(data)
    public static teams: Record<number, Team> = {}
    public availableOperations: ServiceOperation[] = ['get', 'list']

    public async enable(): Promise<boolean> {
        const response = await axios.post(`${this.baseUrl}/enable`, {}, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        return true
    }

    public async disable(): Promise<boolean> {
        const response = await axios.post(`${this.baseUrl}/disable`, {}, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        return true
    }
}
