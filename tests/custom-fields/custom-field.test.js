import CustomField from '../../src/custom-fields/custom-field'


describe('Custom Field', () => {
    it('should instantiate a new custom field', () => {
        const customField = new CustomField({fieldId: 1})
        expect(customField).toBeInstanceOf(CustomField)
    })

})
