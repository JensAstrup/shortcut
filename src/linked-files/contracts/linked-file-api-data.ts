import UUID from '@sx/utils/uuid'


export default interface LinkedFileApiData {
    content_type: string
    created_at: string
    description: string
    entity_type: string
    group_mention_ids: UUID[]
    id: number
    member_mention_ids: UUID[]
    name: string
    size: number | null
    story_ids: number[]
    thumbnail_url: string | null
    type: string
    updated_at: string
    url: string
}
