import axios from 'axios'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import BaseService from '@sx/base-service'
import StoryInterface from '@sx/stories/contracts/story-interface'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'


/**
 * @inheritDoc
 */
export default class StoriesService extends BaseService<Story> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
    protected factory = (data: object) => new Story(data as StoryInterface)

    constructor(init: { headers: Record<string, string> }) {
        super(init)
    }

    /**
     * Search for stories using the [Shortcut Syntax](https://help.shortcut.com/hc/en-us/articles/360000046646-Searching-in-Shortcut-Using-Search-Operators)
     *
     * @example
     * ```typescript
     * const client = new Client()
     * const stories = client.stories.search('type:bug')
     * ```
     *
     * @throws Error if the HTTP status code is 400 or greater
     * @param query
     */
    public async search(query: string): Promise<Story[]> {
        if (query.constructor === Object) {
            const queryEntries = Object.entries(query)
            query = queryEntries.map(([key, value]) => `${key}:${value}`).join(' ')
        }

        const url = new URL('https://api.app.shortcut.com/api/v3/search/stories')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.headers})

        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)

        }

        const storyData: StoryApiData[] = response.data.data ?? []
        return storyData.map((story) => new Story(convertApiFields(story)))

    }
}
