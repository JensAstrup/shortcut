import BaseResource from '@sx/base-resource'
import CustomField from '@sx/custom-fields/custom-field'
import CustomFieldsService from '@sx/custom-fields/custom-fields-service'
import StoryInterface from '@sx/stories/contracts/story-interface'
import StoryCustomFieldInterface from '@sx/stories/custom-fields/contracts/story-custom-field-interface'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


export default class StoryCustomField extends BaseResource<StoryInterface> implements StoryCustomFieldInterface {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
  public availableOperations = []

  constructor(init: StoryCustomFieldInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Get an instance of the custom field that this story custom field is associated with. Due to the way the API works, this is a separate request.
   * For example, `storyCustomField` has a `fieldId` of `1234`, and a value of `someValue`, but it is not possible to see the name of the field
   * without making a separate request.
   */
  get field(): Promise<CustomField> {
    const service = new CustomFieldsService({headers: getHeaders()})
    return service.get(this.fieldId)
  }

  fieldId: UUID
  value: string
  valueId: UUID
  id: UUID | number
}
