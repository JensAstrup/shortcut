import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


export default interface ThreadedCommentInterface extends BaseInterface {
    appUrl: string
    authorId: UUID
    comments: ThreadedCommentInterface[]
    createdAt: string
    deleted: boolean
    entityType: string
    externalId: string | null
    groupMentionIds: UUID[]
    id: number
    memberMentionIds: UUID[]
    mentionIds: UUID[]
    text: string
    updatedAt: string
}