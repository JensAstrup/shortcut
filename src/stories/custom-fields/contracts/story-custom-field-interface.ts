import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


interface StoryCustomFieldInterface extends BaseInterface {
    fieldId: UUID
    value: string
    valueId: UUID
}

export { StoryCustomFieldInterface as default }

