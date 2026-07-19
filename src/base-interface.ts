import {ShortcutFieldType} from '@sx/utils/field-type'
import UUID from '@sx/utils/uuid'

/**
 * Base interface for Shortcut resources, representing the data returned from the API following JavaScript naming conventions.
 */
interface BaseInterface {
    [key: string]: ShortcutFieldType
    id?: UUID | number | null
}

export { BaseInterface as default }

