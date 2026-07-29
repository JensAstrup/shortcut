import {Gettable, Listable, ServiceBaseFor} from '@sx/base-service'
import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import CustomField from '@sx/custom-fields/custom-field'


class CustomFieldsService extends Listable(Gettable(ServiceBaseFor<CustomField, CustomFieldInterface>())) {
  public baseUrl = '/custom-fields'
  protected factory = (data: CustomFieldInterface): CustomField => new CustomField(data)
}

export { CustomFieldsService as default }

