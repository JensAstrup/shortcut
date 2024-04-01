import axios from 'axios'
import {convertApiFields} from '@sx/utils/convert-fields'
import ShortcutResource from '@sx/base-resource'
import BaseData from '@sx/base-data'
import * as console from 'console'


export type ServiceOperation = 'get' | 'search' | 'list'


export default class BaseService<T extends ShortcutResource> {
    public baseUrl = ''
    public headers: Record<string, string>
    // @ts-expect-error This is set on child classes so has no intializer here
    protected factory: (data: object) => T
    protected instances: Record<string, T> = {}
    /** Lists out the available operations for the resource, calling methods not in this list will result in an error */
    public availableOperations: ServiceOperation[] = []

    /**
     * Service classes are not intended to be instantiated directly. Instead, use the {@link Client} class to create instances of services.
     */
    constructor(init: { headers: Record<string, string> }) {
        this.headers = init.headers
    }

    public async get(id: string | number): Promise<T> {
        if (!this.availableOperations.includes('get')) {
            throw new Error('Operation not supported')
        }
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
        if (!this.availableOperations.includes('list')) {
            throw new Error('Operation not supported')
        }
        const response = await axios.get(this.baseUrl, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const instancesData: Record<string, unknown>[] = response.data ?? []
        return instancesData.map((instance) => this.factory(convertApiFields(instance)))
    }
}

export class BaseSearchableService<T extends ShortcutResource> extends BaseService<T> {
    public availableOperations: ServiceOperation[] = ['search']

    /**
     * Search for resources using the [Shortcut Syntax](https://help.shortcut.com/hc/en-us/articles/360000046646-Searching-in-Shortcut-Using-Search-Operators)
     *
     * @example
     * ```typescript
     * const client = new Client()
     * const epics = client.epic.search('My epic')
     * const stories = client.story.search('team:platform')
     * const objectives = client.objective.search({team_id: 123})
     * const iterations = client.iteration.search('team:platform')
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
        return resourceData.map((resource) => this.factory(convertApiFields(resource)))

    }
}
