// UUID is an alias for string, so listing it alongside string here was a redundant union member.
type ShortcutFieldType = string | number | boolean | Date | [] | object | URL | null | undefined

type ShortcutApiFieldType = string | number | boolean | string[] | number[] | boolean[] | [] | object | null

export {ShortcutApiFieldType, ShortcutFieldType}
