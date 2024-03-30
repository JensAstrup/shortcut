import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'

export default interface TaskApiData extends BaseData {
    complete: boolean
    completed_at: string | null
    created_at: string
    description: string
    entity_type: string
    external_id: string | null
    group_member_id: UUID[]
    id: number
    member_mention_ids: UUID[]
    owner_ids: UUID[]
    position: number
    story_id: number
    updated_at: string
}
