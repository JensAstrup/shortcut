import * as process from 'process'

import CustomFieldsService from '@sx/custom-fields/custom-fields-service'
import EpicsService from '@sx/epics/epics-service'
import IterationsService from '@sx/iterations/iterations-service'
import KeyResultsService from '@sx/key-results/key-results-service'
import LabelsService from '@sx/labels/labels-service'
import MembersService from '@sx/members/members-service'
import ObjectivesService from '@sx/objectives/objectives-service'
import StoriesService from '@sx/stories/stories-service'
import TeamsService from '@sx/teams/teams-service'
import WorkflowService from '@sx/workflows/workflows-service'


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
    public teams: TeamsService
    public members: MembersService
    public epics: EpicsService
    public objectives: ObjectivesService
    public keyResults: KeyResultsService
    public labels: LabelsService
    public customFields: CustomFieldsService

    constructor(shortcutApiKey?: string) {
        if (shortcutApiKey) this.shortcutApiKey = shortcutApiKey
        this.stories = new StoriesService({headers: this.headers})
        this.workflows = new WorkflowService({headers: this.headers})
        this.iterations = new IterationsService({headers: this.headers})
        this.teams = new TeamsService({headers: this.headers})
        this.members = new MembersService({headers: this.headers})
        this.epics = new EpicsService({headers: this.headers})
        this.objectives = new ObjectivesService({headers: this.headers})
        this.keyResults = new KeyResultsService({headers: this.headers})
        this.labels = new LabelsService({headers: this.headers})
        this.customFields = new CustomFieldsService({headers: this.headers})
    }

}
