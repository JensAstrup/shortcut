import {Story, StoryData} from "./story"
import snakeToCamel from "@utils/snake-to-camel";

/**
 * Reformats an array of story objects, converting custom field keys from snake_case to camelCase and restructuring
 * the `custom_fields` array into an object indexed by `field_id`. Each `custom_fields` entry is transformed into
 * an object with `value` and `valueId` properties.
 *
 * @param {StoryInterface[]} stories - An array of story objects to be reformatted. Each story object is expected to have
 *                            a `custom_fields` property among other Story-related properties.
 * @returns {StoryInterface[]} A new array of story objects with reformatted field keys and structured custom fields.
 */
export function reformatStoryFields(stories: StoryData[]): Story[] {
    return stories.map((story) => {
        const newStory: { [key: string]: number | object | string } = {};

        for (const [key, value] of Object.entries(story)) {
            if (key === 'custom_fields' && Array.isArray(value)) {
                const customFields: { [fieldId: string]: { value: string; valueId: string } } = {};
                for (const field of value) {
                    customFields[field.fieldId] = { value: field.value, valueId: field.value_id };
                }

                newStory[snakeToCamel(key)] = customFields;
            } else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                // Recursively handle nested objects
                newStory[snakeToCamel(key)] = reformatStoryFields([value])[0];
            }
            else {
                newStory[snakeToCamel(key)] = value;
            }
        }

        return newStory as unknown as Story
    });
}
