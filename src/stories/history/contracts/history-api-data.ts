import BaseData from '@sx/base-data'
import HistoryActionApiData from '@sx/stories/history/actions/contracts/history-action-api-data'
import UUID from '@sx/utils/uuid'


interface HistoryApiData extends BaseData {
    actions: HistoryActionApiData[]
    changed_at: string
    external_id: string
    id: UUID
    member_id: UUID
    references: []
    version: string
    webhook_id: string
}

export { HistoryApiData as default }

