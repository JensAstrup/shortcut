import ShortcutResource from '@sx/base-resource'
import axios from 'axios'
import {getHeaders} from '@sx/utils/headers'
import {StoryComment, StoryCommentData} from '@sx/stories/comment/story-comment'
import {convertApiFields} from '@sx/utils/convert-fields'
import WorkflowService from '@sx/workflows/workflows-service'
import {
    Branch,
    Commit,
    LabelSlim,
    LinkedFile,
    PullRequest,
    StoryCustomField,
    StoryData,
    StoryStats,
    SyncedItem,
    Task,
    TypedStoryLink,
    UploadedFile
} from '@sx/stories/contracts/storyData'
import IterationsService from '@sx/iterations/iterations-service'
import Iteration from '@sx/iterations/iteration'
import TeamService from '@sx/teams/team-service'

export class Story extends ShortcutResource implements StoryData {
    constructor(init: StoryData | object) {
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

    get team() {
        if (!this.groupId) {
            throw new Error('Story does not have a team')
        }
        const service = new TeamService({headers: getHeaders()})
        return service.get(this.groupId)
    }

    public async comment(comment: string): Promise<StoryComment | void> {
        const url = `${Story.baseUrl}/stories/${this.id}/comments`
        const response = await axios.post(url, {text: comment}, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error creating comment: ${error}`)
        })
        const data: StoryCommentData = response.data
        return convertApiFields(data) as unknown as StoryComment
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
    cycleTime!: number
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
    labels!: LabelSlim[]
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
    pullRequests!: PullRequest[]
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
