import {ShortcutApiFieldType} from '@sx/utils/field-type'

/**
 * Represents the data returned from the API.
 */
interface BaseData {
    [key: string]: ShortcutApiFieldType
}

export { BaseData as default }

