import {convertApiFields, convertToApiFields} from '@sx/utils/convert-fields'


describe('convertApiFields', () => {
  test('converts snake_case keys to camelCase', () => {
    const input = {snake_case_key: 'value'}
    const output = convertApiFields(input)
    expect(output).toEqual({snakeCaseKey: 'value'})
  })

  test('converts datetime strings to Date objects', () => {
    const input = {date_time: '2020-01-01T00:00:00Z'}
    // @ts-expect-error - Forcing output type here for testing purposes
    const output: Record<string, Date> = convertApiFields(input)
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


describe('convertToApiFields', () => {
  test('converts camelCase keys to snake_case', () => {
    const input = {camelCaseKey: 'value'}
    const output = convertToApiFields(input)
    expect(output).toEqual({camel_case_key: 'value'})
  })

  test('converts Date objects to ISO strings', () => {
    const date = new Date('2020-01-01T00:00:00.000Z')
    const input = {someDate: date}
    const output = convertToApiFields(input)
    expect(output.some_date).toBe('2020-01-01T00:00:00.000Z')
  })

  test('recursively converts nested objects including Date objects', () => {
    const date = new Date('2020-01-02T00:00:00.000Z')
    const input = {nestedObject: {camelCaseKey: 'value', someDate: date}}
    const output = convertToApiFields(input)
    expect(output).toEqual({
      nested_object: {camel_case_key: 'value', some_date: '2020-01-02T00:00:00.000Z'}
    })
  })

  test('properly handles arrays of objects', () => {
    const input = {arrayOfObjects: [{camelCaseKey: 'value'}, {anotherKey: 'anotherValue'}]}
    const output = convertToApiFields(input)
    expect(output).toEqual({
      array_of_objects: [{camel_case_key: 'value'}, {another_key: 'anotherValue'}]
    })
  })

  test('handles mixed arrays with objects and direct values', () => {
    const input = {mixedArray: ['directValue', {camelCaseKey: 'value'}]}
    const output = convertToApiFields(input)
    expect(output).toEqual({
      mixed_array: ['directValue', {camel_case_key: 'value'}]
    })
  })

  test('preserves direct non-object, non-Date values', () => {
    const input = {stringValue: 'test', numberValue: 123, booleanValue: true}
    const output = convertToApiFields(input)
    expect(output).toEqual({
      string_value: 'test',
      number_value: 123,
      boolean_value: true
    })
  })

  test('converts nested arrays of objects', () => {
    const input = {
      deepNested: {
        nestedArray: [
          {camelCaseKey: 'value'},
          {anotherKey: 'anotherValue', deepDate: new Date('2020-01-03T00:00:00.000Z')}
        ]
      }
    }
    const output = convertToApiFields(input)
    expect(output).toEqual({
      deep_nested: {
        nested_array: [
          {camel_case_key: 'value'},
          {another_key: 'anotherValue', deep_date: '2020-01-03T00:00:00.000Z'}
        ]
      }
    })
  })

  test('handles empty objects and arrays', () => {
    const input = {emptyObject: {}, emptyArray: []}
    const output = convertToApiFields(input)
    expect(output).toEqual({
      empty_object: {},
      empty_array: []
    })
  })
})
