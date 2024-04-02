import BaseInterface from '@sx/base-interface'
import {PullRequestInterface} from '@sx/pull-requests/contracts/pull-request-interface'
import {StoryCommentInterface} from '@sx/stories/comment/contracts/story-comment-interface'
import TaskInterface from '@sx/stories/tasks/contracts/task-interface'

export default interface StoryInterface extends BaseInterface {
    appUrl: string
    archived: boolean
    blocked: boolean
    blocker: boolean
    branches: object[]
    comments: StoryCommentInterface[]
    commits: object[]
    completed: boolean
    completedAt: Date | null
    completedAtOverride: Date | null
    createdAt: Date
    customFields: object[]
    cycleTime: number
    deadline: Date | null
    description: string
    entityType: string
    epicId: number | null
    estimate: number | null
    externalId: string | null
    externalLinks: string[]
    files: object[]
    followerIds: string[]
    groupId: string | null
    groupMentionIds: string[]
    id: number
    iterationId: number | null
    labelIds: number[]
    labels: object[]
    leadTime: number
    linkedFiles: object[]
    memberMentionIds: string[]
    mentionIds: string[]
    movedAt: Date | null
    name: string
    ownerIds: string[]
    position: number
    previousIterationIds: number[]
    projectId: number | null
    pullRequests: PullRequestInterface[]
    requestedById: string
    started: boolean
    startedAt: Date | null
    startedAtOverride: Date | null
    stats: object
    storyLinks: object[]
    storyTemplateId: string | null
    storyType: string
    syncedItem: object
    tasks: TaskInterface[]
    unresolvedBlockerComments: number[]
    updatedAt: Date | null
    workflowId: number
    workflowStateId: number
}
