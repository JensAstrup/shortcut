import BaseService, {ServiceOperation} from '@sx/base-service'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import CustomField from '@sx/custom-fields/custom-field'


export default class CustomFieldsService extends BaseService<CustomField, CustomFieldInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/custom-fields'
  protected factory = (data: CustomFieldInterface) => new CustomField(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']
}
