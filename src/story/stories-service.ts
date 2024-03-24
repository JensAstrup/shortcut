import axios from "axios";
import {Story, StoryData} from "@/story/story";
import {convertKeysToCamelCase} from "@/utils/convert-fields";


export default class StoriesService {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
    private readonly headers: Record<string, any>

    constructor(init: {headers: Record<string, any>}) {
        this.headers = init.headers
    }

    public async get(id: number): Promise<Story> {
        const url = `https://api.app.shortcut.com/api/v3/stories/${id}`
        const response = await axios.get(url, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        const storyData = convertKeysToCamelCase(response.data) as StoryData
        return new Story(storyData)
    }

    public async search(query: string): Promise<Story[]> {
        if (query.constructor === Object) {
            const queryEntries = Object.entries(query)
            query = queryEntries.map(([key, value]) => `${key}:${value}`).join(' ')
        }

        const url = new URL('https://api.app.shortcut.com/api/v3/search/stories')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.headers})

        const storyData: StoryData[] = response.data.data ?? []
        return storyData.map((story) => new Story(convertKeysToCamelCase(story)))

    }
}
