import CustomFieldInterface from '@sx/custom-fields/contracts/custom-field-interface'
import CustomField from '@sx/custom-fields/custom-field'
import CustomFieldsService from '@sx/custom-fields/custom-fields-service'
import StoryCustomFieldInterface from '@sx/stories/custom-fields/contracts/story-custom-field-interface'
import StoryCustomField from '@sx/stories/custom-fields/story-custom-field'


jest.mock('../../../src/utils/headers', () => ({
  getHeaders: jest.fn().mockReturnValue({Authorization: 'Bearer token'})
}))


describe('Story Custom Field', () => {
  it('should instantiate a new custom field', () => {
    const customField = new StoryCustomField({fieldId: '1'} as StoryCustomFieldInterface)
    expect(customField).toBeInstanceOf(StoryCustomField)
  })

  it('should return a field', async () => {
    jest.spyOn(CustomFieldsService.prototype, 'get').mockResolvedValue(new CustomField({
      id: '1',
      values: [{fieldId: '1', value: 'value'} as unknown as CustomFieldInterface]
    } as unknown as CustomFieldInterface))
    const customStoryField: StoryCustomField = new StoryCustomField({fieldId: '1'} as StoryCustomFieldInterface)
    const customField: CustomField = await customStoryField.field
    expect(customField.values).toEqual([{fieldId: '1', value: 'value'}])
    expect(customField).toBeInstanceOf(CustomField)
  })
})
