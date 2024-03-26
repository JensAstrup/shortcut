import BaseData from '@sx/base-data'

export default interface MemberApiData extends BaseData {
    created_at: string
    disabled: boolean
    entity_type: string
    group_ids: string[]
    id: string
    profile: object
    role: string
    state: 'disabled' | 'full' | 'imported' | 'partial'
    updated_at: string
}
