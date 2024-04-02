import BaseCreateInterface from '@sx/base-create-interface'
import BaseData from '@sx/base-data'
import camelToSnake from '@sx/utils/camel-to-snake'
import snakeToCamel from '@sx/utils/snake-to-camel'
import ShortcutResource from '@sx/base-resource'
import isValidDatetimeFormat from '@sx/utils/is-valid-datetime-format'
import BaseInterface from '@sx/base-interface'


type AnyObject = Record<string, unknown>

export function convertApiFields<Input extends BaseData, Resource extends ShortcutResource | BaseInterface>(object: Input): Resource {
    const convertObject = (obj: BaseData | BaseData[]): AnyObject | Array<object> => {
        if (Array.isArray(obj)) {
            return obj.map(item => convertObject(item)) // Recursively process each item in the array
        } else if (obj !== null && typeof obj === 'object') {
            const newObj: AnyObject = {}
            Object.keys(obj).forEach(key => {
                const camelKey = snakeToCamel(key)
                const value = obj[key]
                if (isValidDatetimeFormat(value as string)) {

                    newObj[camelKey] = new Date(value as string)
                } else {
                    newObj[camelKey] = typeof obj[key] === 'object' ? convertObject(obj[key] as AnyObject) : obj[key]
                }
            })
            return newObj
        } else {
            return obj
        }
    }

    return convertObject(object) as Resource
}

export function convertToApiFields<Input extends BaseCreateInterface, U extends BaseData>(object: Input): U {
    const convertObject = (obj: BaseCreateInterface | BaseCreateInterface[]): AnyObject | Array<object> => {
        if (Array.isArray(obj)) {
            return obj.map(item => convertObject(item)) // Recursively process each item in the array
        }
        else if (obj !== null && typeof obj === 'object') {
            const newObj: AnyObject = {}
            Object.keys(obj).forEach(key => {
                const snakeKey = camelToSnake(key)
                const value = obj[key]
                if (value instanceof Date) {
                    newObj[snakeKey] = value.toISOString()
                }
                else {
                    newObj[snakeKey] = typeof obj[key] === 'object' ? convertObject(obj[key] as BaseCreateInterface) : obj[key]
                }
            })
            return newObj
        }
        else {
            return obj
        }
    }

    return convertObject(object) as U
}
