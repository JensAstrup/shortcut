import StoriesService from "@/src/story/stories-service";

export default class Client {
    public stories: StoriesService
    static baseUrl: string = 'https://api.app.shortcut.com/api/v3'

    public headers: { "Shortcut-Token": string; "Content-Type": string } = {
        'Content-Type': 'application/json',
        'Shortcut-Token': process.env.SHORTCUT_API_KEY || ''
    }

    constructor() {
        this.stories = new StoriesService({client: this})
    }

}
