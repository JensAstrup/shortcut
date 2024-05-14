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

  it('should return saved custom field', async () => {
    const storyCustomField = new StoryCustomField({fieldId: '1'} as StoryCustomFieldInterface)
    const customField: CustomField = new CustomField({id: '1'} as CustomFieldInterface)
    const customFieldGet = jest.spyOn(CustomFieldsService.prototype, 'get').mockResolvedValue(customField)
    const savedCustomField: CustomField = await storyCustomField.field
    expect(savedCustomField).toBeInstanceOf(CustomField)
    await expect(storyCustomField.field).resolves.toBeInstanceOf(CustomField)
    expect(customFieldGet).toHaveBeenCalledTimes(1)

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

  it('should return a field name', async () => {
    jest.spyOn(CustomFieldsService.prototype, 'get').mockResolvedValue(new CustomField({
      id: '1',
      name: 'field',
      canonicalName: 'fieldName',
      createdAt: new Date(),
      description: 'description',
      values: [{fieldId: '1', value: 'value'}]
    } as unknown as CustomFieldInterface))
    const customStoryField: StoryCustomField = new StoryCustomField({fieldId: '1'} as StoryCustomFieldInterface)
    const customFieldName: string = await customStoryField.name
    expect(customFieldName).toEqual('field')
  })
})
