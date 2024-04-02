import BaseData from '@sx/base-data'
import CustomFieldEnumValueApiData from '@sx/custom-fields/contracts/custom-field-enum-value-api-data'
import UUID from '@sx/utils/uuid'


export default interface CustomFieldApiData extends BaseData {
    canonical_name: string
    created_at: string
    description: string
    enabled: boolean
    entity_type: string
    field_type: string
    icon_set_identifier: string
    id: UUID
    name: string
    position: number
    updated_at: string
    values: CustomFieldEnumValueApiData[]
}
