import snakeToCamel from "./snake-to-camel";

type AnyObject = Record<string, any>;

export function convertKeysToCamelCase<Input extends AnyObject, U>(object: Input): U {

    const newObject: AnyObject = {}

    Object.keys(object).forEach(key => {
        const camelKey = snakeToCamel(key);
        newObject[camelKey] = object[key];
    });

    return newObject as unknown as U;
}
