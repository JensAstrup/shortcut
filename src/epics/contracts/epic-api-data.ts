import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface EpicApiData extends BaseData {
    app_url: string
    archived: boolean
    associated_groups: []
    completed: boolean
    completed_at: string | null
    completed_at_override: string | null
    deadline: string | null
    description: string
    entity_type: string
    epic_state_id: number
    external_id: string | null
    follower_ids: UUID[]
    group_ids: UUID[]
    id: number
    label_ids: number[]
    labels: []
    member_mention_ids: UUID[]
    mention_ids: UUID[]
    milestone_id: number | null
    name: string
    objective_ids: number[]
    owner_ids: UUID[]
    planned_start_date: string | null
    position: number
    productboard_id: UUID | null
    productboard_name: string | null
    productboard_plugin_id: UUID | null
    productboard_url: string | null
    project_ids: number[]
    requested_by_id: UUID
    started: boolean
    started_at: string | null
    started_at_override: string | null
    stats: object
    stories_without_projects: number
    updated_at: string | null
}