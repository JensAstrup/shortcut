import axios from 'axios'
import {convertKeysToCamelCase} from '@sx/utils/convert-fields'
import ShortcutResource from '@sx/base-resource'


export default class BaseService<T extends ShortcutResource> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/'
    public headers: Record<string, string>
    // @ts-expect-error This is set on child classes
    protected factory: (data: object) => T
    protected instances: Record<string, T> = {}

    constructor(init: { headers: Record<string, string> }) {
        this.headers = init.headers
    }

    public async get(id: number): Promise<T> {
        if (this.instances[id]) {
            return this.instances[id]
        }
        const url = `${this.baseUrl}/${id}`
        const response = await axios.get(url, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const instanceData: object = convertKeysToCamelCase(response.data)
        const instance = this.factory(instanceData)
        this.instances[id] = instance
        return instance
    }

    public async list(): Promise<T[]> {
        const response = await axios.get(this.baseUrl, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const instancesData: Record<string, unknown>[] = response.data ?? []
        return instancesData.map((instance) => this.factory(convertKeysToCamelCase(instance)))
    }

}
