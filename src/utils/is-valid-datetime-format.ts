export default function isValidDatetimeFormat(text: string): boolean {
  const pattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/
  return pattern.test(text)
}
