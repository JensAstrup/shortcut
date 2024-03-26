import snakeToCamel from '@sx/utils/snake-to-camel'
import ShortcutResource from '@sx/base-resource'
import isValidDatetimeFormat from '@sx/utils/is-valid-datetime-format'


type AnyObject = Record<string, unknown>

export function convertApiFields<Input extends AnyObject, U extends ShortcutResource>(object: Input): U {
    const convertObject = (obj: AnyObject | AnyObject[]): AnyObject | Array<object> => {
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

    return convertObject(object) as U
}
