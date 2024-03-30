import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


export interface StoryCommentInterface extends BaseInterface {
    appUrl: string
    authorId: UUID
    blocker: boolean
    createdAt: Date
    deleted: boolean
    entityType: string
    externalId: string | null
    groupMentionIds: UUID[]
    id: number
    memberMentionIds: UUID[]
    parentId: number | null
    position: number
    storyId: number
    text: string | null
    unblocksParent: boolean
    updatedAt: Date
}
