import BaseService, {ServiceOperation} from '@sx/base-service'
import CustomField from '@sx/custom-fields/custom-field'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'

export default class CustomFieldsService extends BaseService<CustomField, CustomFieldInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/custom-fields'
    protected factory = (data: CustomFieldInterface) => new CustomField(data)
    public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}
