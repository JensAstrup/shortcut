import BaseService, {ServiceOperation} from '@sx/base-service'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import CustomField from '@sx/custom-fields/custom-field'


class CustomFieldsService extends BaseService<CustomField, CustomFieldInterface> {
  public baseUrl = '/custom-fields'
  protected factory = (data: CustomFieldInterface): CustomField => new CustomField(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']
}

export { CustomFieldsService as default }

