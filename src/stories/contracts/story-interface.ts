import {PullRequest} from '@sx/pull-requests/contracts/pull-request-api-data'
import {
    Branch,
    Commit,
    LabelSlim, LinkedFile, StoryCustomField, StoryStats, SyncedItem, Task, TypedStoryLink,
    UploadedFile
} from '@sx/stories/contracts/story-api-data'
import {StoryComment} from '@sx/stories/comment/story-comment'
import BaseInterface from '@sx/base-interface'

export default interface StoryInterface extends BaseInterface {
    appUrl: string
    archived: boolean
    blocked: boolean
    blocker: boolean
    branches: Branch[]
    comments: StoryComment[]
    commits: Commit[]
    completed: boolean
    completedAt: Date | null
    completedAtOverride: Date | null
    createdAt: Date
    customFields: StoryCustomField[]
    cycleTime: number
    deadline: Date | null
    description: string
    entityType: string
    epicId: number | null
    estimate: number | null
    externalId: string | null
    externalLinks: string[]
    files: UploadedFile[]
    followerIds: string[]
    groupId: string | null
    groupMentionIds: string[]
    id: number
    iterationId: number | null
    labelIds: number[]
    labels: LabelSlim[]
    leadTime: number
    linkedFiles: LinkedFile[]
    memberMentionIds: string[]
    mentionIds: string[]
    movedAt: Date | null
    name: string
    ownerIds: string[]
    position: number
    previousIterationIds: number[]
    projectId: number | null
    pullRequests: PullRequest[]
    requestedById: string
    started: boolean
    startedAt: Date | null
    startedAtOverride: Date | null
    stats: StoryStats
    storyLinks: TypedStoryLink[]
    storyTemplateId: string | null
    storyType: string
    syncedItem: SyncedItem
    tasks: Task[]
    unresolvedBlockerComments: number[]
    updatedAt: Date | null
    workflowId: number
    workflowStateId: number
}
