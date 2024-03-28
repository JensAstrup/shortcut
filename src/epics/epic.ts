import ShortcutResource from '@sx/base-resource'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import Team from '@sx/teams/team'
import TeamService from '@sx/teams/team-service'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


export default class Epic extends ShortcutResource {
    public static baseUrl: string = 'https://api.app.shortcut.com/api/v3/epics'

    constructor(init: IterationInterface | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    /**
     * Get the teams assigned to the story, labelled as "Group" in the Shortcut API
     * @returns {Promise<Team>}
     */
    get teams(): Promise<Team[]> {
        const service = new TeamService({headers: getHeaders()})
        return service.getMany(this.groupIds)
    }

    /**
     * Get the members following the epic
     * @returns {Promise<Member[]>}
     */
    get followers(): Promise<Member[]> {
        const service: MembersService = new MembersService({headers: getHeaders()})
        return service.getMany(this.followerIds)
    }

    appUrl!: string
    archived!: boolean
    associatedGroups!: []
    completed!: boolean
    completedAt!: string | null
    completedAtOverride!: string | null
    deadline!: string | null
    description!: string
    entityType!: string
    epicStateId!: number
    externalId!: string | null
    followerIds!: UUID[]
    groupIds!: UUID[]
    id!: number
    labelIds!: number[]
    labels!: []
    memberMentionIds!: UUID[]
    mentionIds!: UUID[]
    milestoneId!: number | null
    name!: string
    objectiveIds!: number[]
    ownerIds!: UUID[]
    plannedStartDate!: string | null
    position!: number
    productboardId!: UUID | null
    productboardName!: string | null
    productboardPluginId!: UUID | null
    productboardUrl!: string | null
    projectIds!: number[]
    requestedById!: UUID
    started!: boolean
    startedAt!: string | null
    startedAtOverride!: string | null
    stats!: object
    storiesWithoutProjects!: number
    updatedAt!: string | null
}