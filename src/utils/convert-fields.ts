import snakeToCamel from "./snake-to-camel";

type AnyObject = Record<string, any>;

export function convertKeysToCamelCase<Input extends AnyObject, U>(object: Input): U {
  const convertObject = (obj: AnyObject): AnyObject => {
    if (Array.isArray(obj)) {
      return obj.map(item => convertObject(item)); // Recursively process each item in the array
    } else if (obj !== null && typeof obj === 'object') {
      const newObj: AnyObject = {};
      Object.keys(obj).forEach(key => {
        const camelKey = snakeToCamel(key);
        // Recursively convert objects
        newObj[camelKey] = typeof obj[key] === 'object' ? convertObject(obj[key]) : obj[key];
      });
      return newObj;
    } else {
      return obj;
    }
  };

  return convertObject(object) as unknown as U;
}
