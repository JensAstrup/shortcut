import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import CustomFieldEnumValueInterface from '@sx/custom-fields/contracts/custom-field-enum-value-interface'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import UUID from '@sx/utils/uuid'


export default class CustomField extends ShortcutResource<CustomFieldInterface> implements CustomFieldInterface {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/custom-fields'
  public availableOperations: ResourceOperation[] = ['update', 'delete']

  constructor(init: CustomFieldInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

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
