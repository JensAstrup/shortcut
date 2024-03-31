import BaseData from '@sx/base-data'

export default interface StoryLinkApiData extends BaseData {
    created_at: string
    entity_type: string
    id: number
    object_id: number
    subject_id: number
    type: string
    updated_at: string
    verb: string
}
