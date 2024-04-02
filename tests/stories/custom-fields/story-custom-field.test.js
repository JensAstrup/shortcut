import CustomField from '../../../src/custom-fields/custom-field'
import CustomFieldsService from '../../../src/custom-fields/custom-fields-service'
import StoryCustomField from '../../../src/stories/custom-fields/story-custom-field'


describe('Story Custom Field', () => {
    it('should instantiate a new custom field', () => {
        const customField = new StoryCustomField({fieldId: 1})
        expect(customField).toBeInstanceOf(StoryCustomField)
    })

    it('should return a field', async () => {
        jest.spyOn(CustomFieldsService.prototype, 'get').mockReturnValue(new CustomField({
            id: 1,
            value: 'value'
        }))
        const customStoryField = new StoryCustomField({fieldId: 1})
        const customField = await customStoryField.field
        expect(customField.value).toBe('value')
        expect(customField).toBeInstanceOf(CustomField)
    })
})
