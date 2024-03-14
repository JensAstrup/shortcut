import snakeToCamel from "./snake-to-camel";

type AnyObject = Record<string, any>;

export function convertKeysToCamelCase<T extends AnyObject, U extends AnyObject>(objects: T[], convert: U): AnyObject[] {
    const result: AnyObject = {};
    const results: AnyObject[] = [];
    for (const object of objects) {
        Object.keys(object).forEach(key => {
            result[snakeToCamel(key)] = object[key];
        });
        results.push(result);
    }
    return results;
}
