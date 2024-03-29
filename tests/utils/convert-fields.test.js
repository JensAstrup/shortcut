import {convertApiFields, convertToApiFields} from '../../src/utils/convert-fields'


describe('convertApiFields', () => {
    test('converts snake_case keys to camelCase', () => {
        const input = {snake_case_key: 'value'}
        const output = convertApiFields(input)
        expect(output).toEqual({snakeCaseKey: 'value'})
    })

    test('converts datetime strings to Date objects', () => {
        const input = {date_time: '2020-01-01T00:00:00Z'}
        const output = convertApiFields(input)
        expect(output.dateTime).toBeInstanceOf(Date)
        expect(output.dateTime.toISOString()).toBe('2020-01-01T00:00:00.000Z')
    })

    test('recursively converts nested objects', () => {
        const input = {nested_object: {snake_case_key: 'value'}}
        const output = convertApiFields(input)
        expect(output).toEqual({nestedObject: {snakeCaseKey: 'value'}})
    })

    test('properly handles arrays of objects', () => {
        const input = {array_of_objects: [{snake_case_key: 'value'}]}
        const output = convertApiFields(input)
        expect(output).toEqual({arrayOfObjects: [{snakeCaseKey: 'value'}]})
    })
})


