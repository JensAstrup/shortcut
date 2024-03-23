import * as process from "process";
import StoriesService from "./story/stories-service.js";

export type ShortcutHeaders = { "Shortcut-Token": string; "Content-Type": string }

export default class Client {
    private _headers: ShortcutHeaders | {} = {}

    get headers(): ShortcutHeaders {
        if (this.shortcutApiKey) {
            return {
                'Content-Type': 'application/json',
                'Shortcut-Token': this.shortcutApiKey
            }
        } else if (process.env.SHORTCUT_API_KEY === undefined) throw new Error('Shortcut API Key not found')
        return {
            'Content-Type': 'application/json',
            'Shortcut-Token': process.env.SHORTCUT_API_KEY
        }
    }

    public stories: StoriesService
    static baseUrl: string = 'https://api.app.shortcut.com/api/v3'
    private readonly shortcutApiKey: string | undefined


    constructor(shortcutApiKey?: string) {
        console.log('Hello, world!!')
        this.stories = new StoriesService({headers: this.headers})
        if (shortcutApiKey) this.shortcutApiKey = shortcutApiKey
    }

}
