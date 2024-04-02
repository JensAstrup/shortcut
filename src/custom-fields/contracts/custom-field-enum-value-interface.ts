import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'

export default interface CustomFieldEnumValueInterface extends BaseInterface {
    colorKey: string
    entityType: string
    id: UUID
    position: number
    value: string
}
