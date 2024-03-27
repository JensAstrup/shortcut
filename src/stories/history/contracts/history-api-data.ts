import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface HistoryApiData extends BaseData {
    actions: []
    changed_at: string
    external_id: string
    id: UUID
    member_id: UUID
    primary_id: undefined
    references: []
    version: string
    webhook_id: string
}