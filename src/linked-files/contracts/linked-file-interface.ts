import UUID from '@sx/utils/uuid'


export default interface LinkedFileInterface {
    contentType: string
    createdAt: Date
    description: string
    entityType: string
    groupMentionIds: UUID[]
    id: number
    memberMentionIds: UUID[]
    name: string
    size: number | null
    storyIds: number[]
    thumbnailUrl: string | null
    type: string
    updatedAt: Date
    url: string
}
