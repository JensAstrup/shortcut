import CreateStoryData from '@sx/stories/contracts/create-story-data'
import axios from 'axios'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import BaseService from '@sx/base-service'
import StoryInterface from '@sx/stories/contracts/story-interface'


export default class StoriesService extends BaseService<Story> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
    protected factory = (data: object) => new Story(data as StoryInterface)

    constructor(init: { headers: Record<string, string> }) {
        super(init)
    }

    public async create(story: CreateStoryData): Promise<Story> {
        const response = await axios.post(this.baseUrl, story, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const storyData = convertApiFields(response.data) as StoryInterface
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
        return storyData.map((story) => new Story(convertApiFields(story)))

    }
}
