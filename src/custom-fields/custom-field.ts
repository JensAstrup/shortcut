import {Deletable, ResourceBaseFor, Updatable} from '@sx/base-resource'
import CustomFieldEnumValueInterface from '@sx/custom-fields/contracts/custom-field-enum-value-interface'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import UUID from '@sx/utils/uuid'


class CustomField extends Deletable(Updatable(ResourceBaseFor<CustomFieldInterface>())) implements CustomFieldInterface {
  public baseUrl = '/custom-fields'

  constructor(init: CustomFieldInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

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

export { CustomField as default }

