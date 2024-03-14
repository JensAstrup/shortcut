import axios from "axios";
import {Story, StoryData} from "./story";
import ShortcutResource from "../base-class";
import {convertKeysToCamelCase} from "../utils/convert-fields";

export default class StoriesService extends ShortcutResource{
    public resource: ShortcutResource
    public resourceType: typeof ShortcutResource

    constructor(init: Record<string, ShortcutResource>) {
        super();
        this.resource = init.resource
        this.resourceType = ShortcutResource
    }

    public async get(id: number): Promise<Story> {
        const url = `https://api.app.shortcut.com/api/v3/stories/${id}`
        const response = await axios.get(url, {headers: Story.headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        return new Story(response.data)
    }

    public async search(query: string): Promise<Story[]> {
        if (query.constructor === Object) {
            const queryEntries = Object.entries(query)
            query = queryEntries.map(([key, value]) => `${key}:${value}`).join(' ')
        }

        const url = new URL('https://api.app.shortcut.com/api/v3/search/stories')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.resourceType.headers})

        const stories: StoryData[] = response.data.data ?? []
        return convertKeysToCamelCase(stories, Story) as Story[]
    }
}
