import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


export default interface UploadedFileInterface extends BaseInterface {
    contentType: string
    createdAt: Date
    description: string | null
    entityType: string
    externalId: string | null
    filename: string
    groupMentionIds: UUID[]
    id: number
    memberMentionIds: UUID[]
    name: string
    size: number
    storyIds: number[]
    thumbnailUrl: string | null
    updatedAt: Date | null
    uploaderId: UUID
}
