import ShortcutResource from '@sx/base-resource'
import {getHeaders} from '@sx/utils/headers'
import axios from 'axios'
import {Story} from '@sx/story/story'
import {convertKeysToCamelCase} from '@sx/utils/convert-fields'


export default class Team extends ShortcutResource {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/groups' // Shortcut renamed groups to teams
    public createFields: string[] = ['name', 'mentionName']

    get stories() {
        return this.getStories()
    }

    public async getStories(): Promise<Story[]> {
        const url = new URL(`${Team.baseUrl}/${this.id}/stories`)
        const response = await axios.get(url.toString(), {headers: getHeaders()}).catch((error: string) => {
            throw new Error(`Error fetching stories: ${error}`)
        })
        const storiesData: Record<string, unknown>[] = response.data.data ?? []
        return storiesData.map((story) => new Story(convertKeysToCamelCase(story)))

    }
    appUrl!: string
    archived!: boolean
    color!: string
    colorKey!: string
    description!: string
    displayIcon!: string
    entityType !: string
    id!: number
    memberIds!: number[]
    mentionName!: string
    name!: string
    numEpicsStarted!: number
    numStoriesStarted!: number
    workflowIds!: number[]
}
