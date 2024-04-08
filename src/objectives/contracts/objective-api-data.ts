import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface ObjectiveApiData extends BaseData {
    app_url: string
    archived: boolean
    categories: object[]
    completed: boolean
    completed_at: string | null
    completed_at_override: string | null
    created_at: string
    description: string
    entity_type: string
    id: number
    key_result_ids: UUID[]
    name: string
    position: number
    started: boolean
    started_at: string | null
    started_at_override: string | null
    state: string
    stats: object
    updated_at: string
}
