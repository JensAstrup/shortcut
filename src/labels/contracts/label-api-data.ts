import BaseData from '@sx/base-data'

export default interface LabelApiData extends BaseData {
    app_url: string
    archived: boolean
    color: string | null
    created_at: string | null
    description: string | null
    entity_type: string
    external_id: string | null
    id: number
    name: string
    stats: object[]
    updated_at: string | null
}
