import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


export default interface ObjectiveInterface extends BaseInterface {
    appUrl: string
    archived: boolean
    categories: object[]
    completed: boolean
    completedAt: Date | null
    completedAtOverride: Date | null
    createdAt: Date
    description: string
    entityType: string
    id: number
    keyResultIds: UUID[]
    name: string
    position: number
    started: boolean
    startedAt: Date | null
    startedAtOverride: Date | null
    state: string
    stats: object
    updatedAt: Date
}
