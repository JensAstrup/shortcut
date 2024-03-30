import BaseService from '@sx/base-service'
import Epic from '@sx/epics/epic'
import axios from 'axios'
import EpicApiData from '@sx/epics/contracts/epic-api-data'
import {convertApiFields} from '@sx/utils/convert-fields'


export default class EpicsService extends BaseService<Epic> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/epics'
    protected factory = (data: object) => new Epic(data)
    public static epics: Record<number, Epic> = {}

    /**
     * Search for epic using the [Shortcut Syntax](https://help.shortcut.com/hc/en-us/articles/360000046646-Searching-in-Shortcut-Using-Search-Operators)
     *
     * @example
     * ```typescript
     * const client = new Client()
     * const epics = client.epic.search('My epic')
     * ```
     *
     * @throws Error if the HTTP status code is 400 or greater
     * @param query
     */
    public async search(query: string): Promise<Epic[]> {
        const url = new URL('https://api.app.shortcut.com/api/v3/search/stories')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.headers})

        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)

        }

        const epicData: EpicApiData[] = response.data.data ?? []
        return epicData.map((epic) => new Epic(convertApiFields(epic)))

    }
}
