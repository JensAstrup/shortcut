import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'

export default interface StoryCustomFieldApiData extends BaseData {
    field_id: UUID
    value: string
    value_id: UUID
}
