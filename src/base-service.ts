import axios from 'axios'
import {convertApiFields} from '@sx/utils/convert-fields'
import ShortcutResource from '@sx/base-resource'
import BaseData from '@sx/base-data'


export default class BaseService<T extends ShortcutResource> {
    public baseUrl = ''
    public headers: Record<string, string>
    // @ts-expect-error This is set on child classes so has no intializer here
    protected factory: (data: object) => T
    protected instances: Record<string, T> = {}

    /**
     * Service classes are not intended to be instantiated directly. Instead, use the {@link Client} class to create instances of services.
     */
    constructor(init: { headers: Record<string, string> }) {
        this.headers = init.headers
    }

    public async get(id: string | number): Promise<T> {
        if (this.instances[id]) {
            return this.instances[id]
        }
        const url = `${this.baseUrl}/${id}`
        const response = await axios.get(url, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const instanceData: object = convertApiFields(response.data)
        const instance = this.factory(instanceData)
        this.instances[id] = instance
        return instance
    }

    public async getMany(ids: string[] | number[]): Promise<T[]> {
        return Promise.all(ids.map(id => this.get(id)))
    }

    public async list(): Promise<T[]> {
        const response = await axios.get(this.baseUrl, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const instancesData: Record<string, unknown>[] = response.data ?? []
        return instancesData.map((instance) => this.factory(convertApiFields(instance)))
    }

}

export class BaseSearchableService<T extends ShortcutResource> extends BaseService<T> {
    /**
     * Search for epics using the [Shortcut Syntax](https://help.shortcut.com/hc/en-us/articles/360000046646-Searching-in-Shortcut-Using-Search-Operators)
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
    public async search(query: string): Promise<T[]> {
        const url = new URL('https://api.app.shortcut.com/api/v3/search/stories')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.headers})

        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)

        }

        const resourceData: BaseData[] = response.data.data ?? []
        return resourceData.map((resource) => (convertApiFields(resource) as T))

    }
}
