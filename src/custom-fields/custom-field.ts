import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import UUID from '@sx/utils/uuid'
import CustomFieldEnumValueInterface from '@sx/custom-fields/contracts/custom-field-enum-value-interface'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'

export default class CustomField extends ShortcutResource<CustomFieldInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/custom-fields'
    public availableOperations: ResourceOperation[] = ['update', 'delete']

    canonicalName!: string
    createdAt!: Date
    description!: string
    enabled!: boolean
    entityType!: string
    fieldType!: string
    iconSetIdentifier!: string
    id!: UUID
    name!: string
    position!: number
    updatedAt!: Date
    values!: CustomFieldEnumValueInterface[]
}
