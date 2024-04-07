import UUID from '@sx/utils/uuid'


export default interface CustomFieldEnumValueApiData {
    color_key: string
    entity_type: string
    id: UUID
    position: number
    value: string
}
