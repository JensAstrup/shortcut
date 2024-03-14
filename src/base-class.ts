import StoriesService from "./story/stories-service";

export default class ShortcutResource {
    private get workflows(): { [p: number]: { [p: string]: unknown } } {
        return this._workflows;
    }

    private set workflows(value: { [p: number]: { [p: string]: unknown } }) {
        this._workflows = value;
    }
    static baseUrl: string = 'https://api.app.shortcut.com/api/v3'
    public static headers: { "Shortcut-Token": string; "Content-Type": string } = {
        'Content-Type': 'application/json',
        'Shortcut-Token': process.env.SHORTCUT_API_KEY || ''
    }

    public stories: StoriesService

    constructor() {
        this.stories = new StoriesService({"client": this})
    }

    protected _workflows: {[key: number]: {[key: string]: unknown}} = {500_000_006: {name: 'In Development'}}

}
