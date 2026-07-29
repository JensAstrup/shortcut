// The time-of-day portion is optional so that date-only fields (e.g. an iteration's `start_date`/
// `end_date`, which the Shortcut API sends as bare `YYYY-MM-DD`) still get parsed into a `Date`.
function isValidDatetimeFormat(text: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2}(\.\d{1,3})?Z)?$/
  return pattern.test(text)
}

export default isValidDatetimeFormat
