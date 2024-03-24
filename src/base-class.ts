import camelToSnake from '@utils/camel-to-snake'
import axios from 'axios'
import {getHeaders} from '@utils/headers'
import snakeToCamel from '@utils/snake-to-camel'

export default class ShortcutResource<T = object> {
    [key: string]: unknown

    protected changedFields: string[] = [] // Fields that have been changed, used to determine what to update
    public static baseUrl = 'https://api.app.shortcut.com/api/v3'
    public createFields: string[] = [] // Fields that are used when creating a new resource

    constructor(init?: T) {
        if (init) {
            Object.assign(this, init)
        }
        this.changedFields = []
        // Return a Proxy object to intercept property access and set operations on derived classes
        return new Proxy(this, {
            get(target, property, receiver) {
                return Reflect.get(target, property, receiver)
            },
            set(target, property, value, receiver) {
                // Track all changes made to the object
                if (!target.changedFields.includes(String(property))) {
                    target.changedFields.push(String(property))
                }
                return Reflect.set(target, property, value, receiver)
            }
        })
    }

    private async update(): Promise<void> {
        const baseUrl = (this.constructor as typeof ShortcutResource).baseUrl
        const url = `${baseUrl}/stories/${this.id}`
        const body = this.changedFields.reduce((acc: Record<string, unknown>, field) => {
            acc[camelToSnake(field)] = this[field]
            return acc
        }, {})

        const response = await axios.put(url, body, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error saving story: ${error}`)
        })

        const data: Record<string, unknown> = response.data
        Object.keys(data).forEach(key => {
            this[snakeToCamel(key)] = data[key]
        })

        this.changedFields = []
    }

    private async create(): Promise<this> {
        const baseUrl = (this.constructor as typeof ShortcutResource).baseUrl
        const body: Record<string, unknown> = {}
        Object.keys(this).forEach(key => {
            if (this.createFields.includes(key)) {
                body[camelToSnake(key)] = this[key]
            }
        })

        const response = await axios.post(baseUrl, body, {headers: getHeaders()})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }

        return Object.assign(this, response.data)
    }

    public async save(): Promise<void> {
        if (this.id) {
            await this.update()
        } else {
            await this.create()
        }
    }

    public async delete(): Promise<void> {
        const url = `${this.baseUrl}/stories/${this.id}`
        await axios.delete(url, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error deleting story: ${error}`)
        })
    }
}
