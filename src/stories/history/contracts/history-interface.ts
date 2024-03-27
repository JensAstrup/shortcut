import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


export default interface HistoryInterface extends BaseInterface {
    actions: []
    changedAt: Date
    externalId: string
    id: UUID
    memberId: UUID
    primaryId: undefined
    references: []
    version: string
    webhookId: string
}