import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface UploadedFileApiData extends BaseData {
    content_type: string
    created_at: string
    description: string | null
    entity_type: string
    external_id: string | null
    filename: string
    group_mention_ids: UUID[]
    id: number
    member_mention_ids: UUID[]
    name: string
    size: number
    story_ids: number[]
    thumbnail_url: string | null
    updated_at: string | null
    uploader_id: UUID
}
