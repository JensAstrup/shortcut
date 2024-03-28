import BaseInterface from '@sx/base-interface'
import HistoryActionInterface from '@sx/stories/history/contracts/history-action-interface'
import UUID from '@sx/utils/uuid'


export default interface HistoryInterface extends BaseInterface {
    actions: HistoryActionInterface[]
    changedAt: Date
    externalId: string
    id: UUID
    memberId: UUID
    primaryId: undefined
    references: []
    version: string
    webhookId: string
}