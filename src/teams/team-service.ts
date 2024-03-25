import BaseService from '@sx/base-service'
import Team from '@sx/teams/team'
import axios from 'axios'

export default class TeamService extends BaseService<Team> {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/groups'
    protected factory = (data: object) => new Team(data)
    public static teams: Record<number, Team> = {}

    public async enable(): Promise<boolean> {
        const response = await axios.post(`${TeamService.baseUrl}/enable`, {}, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        return true
    }

    public async disable(): Promise<boolean> {
        const response = await axios.post(`${TeamService.baseUrl}/disable`, {}, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        return true
    }
}
