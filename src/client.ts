import EpicsService from '@sx/epics/epics-service'
import * as process from 'process'
import StoriesService from '@sx/stories/stories-service'
import WorkflowService from '@sx/workflows/workflows-service'
import IterationsService from '@sx/iterations/iterations-service'
import TeamService from '@sx/teams/team-service'
import MembersService from '@sx/members/members-service'
import ObjectivesService from '@sx/objectives/objectives-service'

export type ShortcutHeaders = { 'Shortcut-Token': string; 'Content-Type': string }

export default class Client {
    get headers(): ShortcutHeaders {
        if (this.shortcutApiKey) {
            return {
                'Content-Type': 'application/json',
                'Shortcut-Token': this.shortcutApiKey
            }
        } else if (!process.env.SHORTCUT_API_KEY) throw new Error('Shortcut API Key not found')
        return {
            'Content-Type': 'application/json',
            'Shortcut-Token': process.env.SHORTCUT_API_KEY
        }
    }

    static baseUrl: string = 'https://api.app.shortcut.com/api/v3'
    private readonly shortcutApiKey: string | undefined

    public stories: StoriesService
    public workflows: WorkflowService
    public iterations: IterationsService
    public teams: TeamService
    public members: MembersService
    public epics: EpicsService
    public objectives: ObjectivesService

    constructor(shortcutApiKey?: string) {
        if (shortcutApiKey) this.shortcutApiKey = shortcutApiKey
        this.stories = new StoriesService({headers: this.headers})
        this.workflows = new WorkflowService({headers: this.headers})
        this.iterations = new IterationsService({headers: this.headers})
        this.teams = new TeamService({headers: this.headers})
        this.members = new MembersService({headers: this.headers})
        this.epics = new EpicsService({headers: this.headers})
        this.objectives = new ObjectivesService({headers: this.headers})
    }

}
