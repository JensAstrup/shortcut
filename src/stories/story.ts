import ShortcutResource from '@sx/base-resource'
import Epic from '@sx/epics/epic'
import EpicsService from '@sx/epics/epics-service'
import HistoryApiData from '@sx/stories/history/contracts/history-api-data'
import HistoryInterface from '@sx/stories/history/contracts/history-interface'
import {WorkflowStateInterface} from '@sx/workflows/contracts/workflow-state-interface'
import axios from 'axios'
import {getHeaders} from '@sx/utils/headers'
import {StoryComment, StoryCommentData} from '@sx/stories/comment/story-comment'
import {convertApiFields} from '@sx/utils/convert-fields'
import WorkflowService from '@sx/workflows/workflows-service'
import {
    Branch,
    Commit,
    LinkedFile,
    StoryCustomField,
    StoryStats,
    SyncedItem,
    Task,
    TypedStoryLink,
    UploadedFile
} from '@sx/stories/contracts/story-api-data'
import IterationsService from '@sx/iterations/iterations-service'
import Iteration from '@sx/iterations/iteration'
import TeamsService from '@sx/teams/teams-service'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Label from '@sx/labels/label'


/**
 * @story
 * @inheritDoc
 * See also:
 * - {@link StoriesService} for the service managing stories.
 */
export default class Story extends ShortcutResource {
    constructor(init: StoryInterface | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    get workflow() {
        return WorkflowService.getWorkflowState(this.workflowStateId)
    }

    get iteration(): Promise<Iteration> {
        if (!this.iterationId) {
            throw new Error('Story does not have an iteration')
        }
        const iterationService = new IterationsService({headers: getHeaders()})
        return iterationService.get(this.iterationId)
    }

    /**
     * Get the team assigned to the story, labelled as "Group" in the Shortcut API
     * @returns {Promise<Team>}
     */
    get team() {
        if (!this.groupId) {
            throw new Error('Story does not have a team')
        }
        const service = new TeamsService({headers: getHeaders()})
        return service.get(this.groupId)
    }

    /**
     * Get the owners of the story
     * @returns {Promise<Member[]>}
     */
    get owners(): Promise<Member[]> {
        const service = new MembersService({headers: getHeaders()})
        return service.getMany(this.ownerIds)
    }

    /**
     * Get the epic of the story
     * @returns {Promise<Epic>}
     */
    get epic(): Promise<Epic> {
        if (!this.epicId) {
            throw new Error('Story does not have an epic')
        }
        const service = new EpicsService({headers: getHeaders()})
        return service.get(this.epicId)
    }

    public async history(): Promise<HistoryInterface[]> {
        const url = `${Story.baseUrl}/stories/${this.id}/history`
        const response = await axios.get(url, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error fetching history: ${error}`)
        })
        const historyData: HistoryApiData[] = response.data
        return historyData.map((history) => convertApiFields(history) as HistoryInterface)
    }

    /**
     * Calculates the cycle time of a story in hours.
     *
     * @returns {Promise<number>} - The cycle time in hours.
     * @throws {Error} - If the story is not completed or has not been started.
     */
    public async cycleTime(): Promise<number> {
        const startedAt: Date | null = this.startedAt
        const completedAt: Date | null = this.completedAt

        if (!startedAt || !completedAt) {
            throw new Error('Story does not have a cycle time')
        }

        return (completedAt.getTime() - startedAt.getTime()) / (1000 * 60 * 60)
    }

    /**
     * Calculates the time a story has been in development in hours.
     *
     * @returns {Promise<number>} - The time in development in hours.
     * @throws {Error} - If the story is already finished or not started.
     */
    public async timeInDevelopment(): Promise<number> {
        const workflow: WorkflowStateInterface = await this.workflow
        if (workflow.type === 'Finished') {
            throw new Error('Story is already finished')
        }
        if (!this.startedAt) {
            throw new Error('Story is not started')
        }
        return (new Date().getTime() - this.startedAt!.getTime()) / (1000 * 60 * 60)
    }

    public async comment(comment: string): Promise<StoryComment | void> {
        const url = `${Story.baseUrl}/stories/${this.id}/comments`
        const response = await axios.post(url, {text: comment}, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error creating comment: ${error}`)
        })
        const data: StoryCommentData = response.data
        return convertApiFields(data) as StoryComment
    }

    appUrl!: string
    archived!: boolean
    blocked!: boolean
    blocker!: boolean
    branches!: Branch[]
    comments!: StoryComment[]
    commits!: Commit[]
    completed!: boolean
    completedAt!: Date | null
    completedAtOverride!: Date | null
    createdAt!: Date
    customFields!: StoryCustomField[]
    deadline!: Date | null
    description!: string
    entityType!: string
    epicId!: number | null
    estimate!: number | null
    externalId!: string | null
    externalLinks!: string[]
    files!: UploadedFile[]
    followerIds!: string[]
    groupId!: string | null
    groupMentionIds!: string[]
    id!: number
    iterationId!: number | null
    labelIds!: number[]
    labels!: Label[]

    /* The lead time in seconds of this story */
    leadTime!: number
    linkedFiles!: LinkedFile[]
    memberMentionIds!: string[]
    mentionIds!: string[]
    movedAt!: Date | null
    name!: string
    ownerIds!: string[]
    position!: number
    previousIterationIds!: number[]
    projectId!: number | null
    requestedById!: string
    started!: boolean
    startedAt!: Date | null
    startedAtOverride!: Date | null
    stats!: StoryStats
    storyLinks!: TypedStoryLink[]
    storyTemplateId!: string | null
    storyType!: string
    syncedItem!: SyncedItem
    tasks!: Task[]
    unresolvedBlockerComments!: number[]
    updatedAt!: Date | null
    workflowId!: number
    workflowStateId!: number
}
