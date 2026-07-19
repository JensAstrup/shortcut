import BaseInterface from '@sx/base-interface'
import CustomFieldEnumValueInterface from '@sx/custom-fields/contracts/custom-field-enum-value-interface'
import UUID from '@sx/utils/uuid'


interface CustomFieldInterface extends BaseInterface {
    canonicalName: string
    createdAt: Date
    description: string
    enabled: boolean
    entityType: string
    fieldType: string
    iconSetIdentifier: string
    id: UUID
    name: string
    position: number
    updatedAt: Date
    values: CustomFieldEnumValueInterface[]
}

export { CustomFieldInterface as default }

