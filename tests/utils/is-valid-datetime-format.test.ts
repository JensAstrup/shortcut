import isValidDatetimeFormat from '@sx/utils/is-valid-datetime-format'


describe('isValidDateTimeFormat', () => {
  it('should return true for valid date time format', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00Z')).toBe(true)
  })

  it('should return false for invalid date time format', () => {
    expect(isValidDatetimeFormat('2021-01-01')).toBe(false)
  })

  it('should return true for date without milliseconds', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00Z')).toBe(true)
  })

  it('should return true for date with milliseconds', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00.000Z')).toBe(true)
  })
})
