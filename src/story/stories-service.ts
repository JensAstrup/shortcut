import axios from 'axios'
import {Story} from '@sx/story/story'
import {convertKeysToCamelCase} from '@sx/utils/convert-fields'
import {StoryData} from '@sx/story/contracts/storyData'
import BaseService from '@sxbase-service'


export default class StoriesService extends BaseService<Story> {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
    protected factory = (data: object) => new Story(data)

    constructor(init: { headers: Record<string, string> }) {
        super(init)
    }

    public async create(story: CreateStoryData): Promise<Story> {
        const response = await axios.post(StoriesService.baseUrl, story, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
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

        const storyData: Record<string, unknown>[] = response.data.data ?? []
        return storyData.map((story) => new Story(convertKeysToCamelCase(story)))

    }
}
