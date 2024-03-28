import {Label} from '@sx/iterations/contracts/iteration-interface'


/**
 * @typedef {object} BaseCreateData
 *
 * Represents the data used for creating shortcut resources.
 *
 * @property {string|number|boolean|Date|null|string[]|number[]|Label[]|undefined} key
 *    A key-value pair representing the property of the entity.
 */
export default interface BaseCreateData {
    [key: string]: string | number | boolean | Date | null | string[] | number[] | Label[] | undefined
}