import BaseCreateInterface from '@sx/base-create-interface'
import UUID from '@sx/utils/uuid'


export default interface ThreadedCommentCreateData extends BaseCreateInterface {
    authorId: UUID | null
    createdAt: Date | null
    externalId: string | null
    text: string
    updatedAt: Date | null
}