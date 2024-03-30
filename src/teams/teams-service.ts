import BaseService, {ServiceOperation} from '@sx/base-service'
import Team from '@sx/teams/team'
import axios from 'axios'

export default class TeamsService extends BaseService<Team> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/groups'
    protected factory = (data: object) => new Team(data)
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
