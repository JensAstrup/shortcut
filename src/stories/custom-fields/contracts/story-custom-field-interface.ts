import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'

export default interface StoryCustomFieldInterface extends BaseInterface {
    fieldId: UUID
    value: string
    valueId: UUID
}
