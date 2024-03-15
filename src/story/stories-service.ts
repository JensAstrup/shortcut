import axios from "axios";
import {Story, StoryData} from "@/src/story/story";
import {convertKeysToCamelCase} from "@/src/utils/convert-fields";
import type Client from "@/src/client";


export default class StoriesService {
    private readonly client: Client

    constructor(init: {client: Client}) {
        this.client = init.client
    }

    public async get(id: number): Promise<Story> {
        const url = `https://api.app.shortcut.com/api/v3/stories/${id}`
        const response = await axios.get(url, {headers: this.client.headers})
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

        const response = await axios.get(url.toString(), {headers: this.client.headers})

        const stories: StoryData[] = response.data.data ?? []
        return convertKeysToCamelCase(stories, Story) as Story[]
    }
}
