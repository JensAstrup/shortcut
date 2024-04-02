import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import EpicInterface from '@sx/epics/contracts/epic-interface'
import IterationInterface, {IterationStats, Label} from '@sx/iterations/contracts/iteration-interface'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import {getHeaders} from '@sx/utils/headers'


/**
 * @InheritDoc
 */
export default class Iteration extends ShortcutResource<EpicInterface> {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    public createFields: string[] = ['name', 'startDate', 'endDate', 'labels']
    public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

    get teams(): Promise<Team[]> {
        const service = new TeamsService({headers: getHeaders()})
        return service.getMany(this.groupIds)
    }

    appUrl!: string
    createdAt!: Date
    endDate!: string
    entityType!: string
    followerIds!: string[]
    groupIds!: string[]
    groupMentionIds!: string[]
    id!: number
    labelIds!: number[]
    labels!: Label[]
    memberMentionIds!: string[]
    mentionIds!: string[]
    name!: string
    startDate!: Date
    stats!: IterationStats
    status!: 'unstarted' | 'started' | 'done'
    updatedAt!: Date

    constructor(init: IterationInterface | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }
}
