import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface ThreadedCommentApiData extends BaseData {
    app_url: string
    author_id: UUID
    comments: ThreadedCommentApiData[]
    created_at: string
    deleted: boolean
    entity_type: string
    external_id: string | null
    group_mention_ids: UUID[]
    id: number
    member_mention_ids: UUID[]
    mention_ids: UUID[]
    text: string
    updated_at: string
}