import isValidDatetimeFormat from '@sx/utils/is-valid-datetime-format'


describe('isValidDateTimeFormat', () => {
  it('should return true for valid date time format', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00Z')).toBe(true)
  })

  it('should return false for invalid date time format', () => {
    expect(isValidDatetimeFormat('01-2021-01')).toBe(false)
  })

  // Date-only fields (e.g. an iteration's start_date/end_date) come back from the API as bare
  // YYYY-MM-DD, with no time-of-day component, and still need to be parsed into a Date.
  it('should return true for a date-only string', () => {
    expect(isValidDatetimeFormat('2021-01-01')).toBe(true)
  })

  it('should return true for date without milliseconds', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00Z')).toBe(true)
  })

  it('should return true for date with milliseconds', () => {
    expect(isValidDatetimeFormat('2021-01-01T00:00:00.000Z')).toBe(true)
  })
})
