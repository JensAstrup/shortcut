import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface StoryCommentApiData extends BaseData {
    app_url: string
    author_id: UUID
    blocker: boolean
    created_at: string
    deleted: boolean
    entity_type: string
    external_id: string | null
    group_mention_ids: UUID[]
    id: number
    member_mention_ids: UUID[]
    parent_id: number | null
    position: number
    story_id: number
    text: string | null
    unblocks_parent: boolean
    updated_at: string
}
