import snakeToCamel from '@sx/utils/snake-to-camel'


type AnyObject = Record<string, unknown>

export function convertKeysToCamelCase<Input extends AnyObject, U>(object: Input): U {
    const convertObject = (obj: AnyObject | AnyObject[]): AnyObject | Array<object> => {
        if (Array.isArray(obj)) {
            return obj.map(item => convertObject(item)) // Recursively process each item in the array
        }
        else if (obj !== null && typeof obj === 'object') {
            const newObj: AnyObject = {}
            Object.keys(obj).forEach(key => {
                const camelKey = snakeToCamel(key)
                const propertyType = Reflect.getMetadata('resourceType', obj.constructor.prototype, key)
                if (propertyType) {
                    newObj[camelKey] = new propertyType(obj[key])
                }
                else {
                    newObj[camelKey] = typeof obj[key] === 'object' ? convertObject(obj[key] as AnyObject) : obj[key]
                }
            })
            return newObj
        }
        else {
            return obj
        }
    }

    return convertObject(object) as unknown as U
}
