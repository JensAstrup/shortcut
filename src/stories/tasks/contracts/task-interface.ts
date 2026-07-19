import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


interface TaskInterface extends BaseInterface {
    complete: boolean
    completedAt: Date | null
    createdAt: Date
    description: string
    entityType: string
    externalId: string | null
    groupMemberId: UUID[]
    id: number
    memberMentionIds: UUID[]
    ownerIds: UUID[]
    position: number
    storyId: number
    updatedAt: Date
}

export { TaskInterface as default }

