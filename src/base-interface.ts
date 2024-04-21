import UUID from '@sx/utils/uuid'

/**
 * Base interface for Shortcut resources, representing the data returned from the API following JavaScript naming conventions.
 */
export default interface BaseInterface {
    id?: UUID | number | null
}
