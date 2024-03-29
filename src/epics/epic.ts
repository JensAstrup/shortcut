import BaseData from '@sx/base-data'
import ShortcutResource from '@sx/base-resource'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import Team from '@sx/teams/team'
import TeamService from '@sx/teams/team-service'
import ThreadedCommentApiData from '@sx/threaded-comments/contracts/threaded-comment-api-data'
import ThreadedCommentCreateData from '@sx/threaded-comments/contracts/threaded-comment-create-data'
import ThreadedCommentInterface from '@sx/threaded-comments/contracts/threaded-comment-interface'
import {convertApiFields, convertToApiFields} from '@sx/utils/convert-fields'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'
import axios from 'axios'


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

    /**
     * Add a comment to the epic authored by the user associated with the API key currently in use
     *
     * @example
     * ```typescript
     * const epic = new Epic({id: 123})
     * epic.comment('This is a comment').then((comment) => {
     *    console.log(comment)
     * })
     * ```
     * @param comment
     */
    public async comment(comment: string): Promise<ThreadedCommentInterface | void> {
        const url = `${Epic.baseUrl}/epics/${this.id}/comments`
        const response = await axios.post(url, {text: comment}, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error creating comment: ${error}`)
        })
        const data: ThreadedCommentApiData = response.data
        return convertApiFields(data) as ThreadedCommentInterface
    }

    /**
     * Add a comment to the epic using the provided comment data. If you're just looking to add a comment from the authorized user, use the `comment` method.
     *
     * @param comment
     * @returns {Promise<ThreadedCommentInterface | void>}
     * {@link Epic.comment}
     *
     * {@link ThreadedCommentCreateData}
     */
    public async addComment(comment: ThreadedCommentCreateData): Promise<ThreadedCommentInterface | void> {
        const url = `${Epic.baseUrl}/epics/${this.id}/comments`
        const requestData: BaseData = convertToApiFields(comment)
        const response = await axios.post(url, requestData, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error creating comment: ${error}`)
        })
        const data: ThreadedCommentApiData = response.data
        return convertApiFields(data) as ThreadedCommentInterface
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