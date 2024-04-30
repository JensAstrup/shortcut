import {ShortcutApiFieldType} from '@sx/utils/field-type'

/**
 * Represents the data returned from the API.
 */
export default interface BaseData {
    [key: string]: ShortcutApiFieldType
}
