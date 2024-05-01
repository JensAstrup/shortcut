import UUID from '@sx/utils/uuid'


type ShortcutFieldType = string | number | boolean | Date | UUID | [] | object | URL | null | undefined

type ShortcutApiFieldType = string | number | boolean | string[] | number[] | boolean[]  | UUID | [] | object | null

export {ShortcutApiFieldType, ShortcutFieldType}
