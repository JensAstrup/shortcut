import BaseInterface from '@sx/base-interface'
import HistoryActionInterface from '@sx/stories/history/actions/contracts/history-action-interface'
import UUID from '@sx/utils/uuid'


interface HistoryInterface extends BaseInterface {
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
export default HistoryInterface
