import axios from 'axios'

import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import Story from '@sx/stories/story'
import TeamInterface from '@sx/teams/contracts/team-interface'
import {convertApiFields} from '@sx/utils/convert-fields'
import {getHeaders} from '@sx/utils/headers'


/**
 * @inheritDoc
 */
export default class Team extends ShortcutResource<TeamInterface> {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/groups' // Shortcut renamed groups to teams
    public createFields: string[] = ['name', 'mentionName']
    public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

    get stories() {
        return this.getStories()
    }

    public async getStories(): Promise<Story[]> {
        const url = new URL(`${Team.baseUrl}/${this.id}/stories`)
        const response = await axios.get(url.toString(), {headers: getHeaders()}).catch((error: string) => {
            throw new Error(`Error fetching stories: ${error}`)
        })
        const storiesData: Record<string, unknown>[] = response.data.data ?? []
        return storiesData.map((story) => new Story(convertApiFields(story)))

    }
    appUrl!: string
    archived!: boolean
    color!: string
    colorKey!: string
    description!: string
    displayIcon!: string
    entityType !: string
    id!: string
    memberIds!: number[]
    mentionName!: string
    name!: string
    numEpicsStarted!: number
    numStoriesStarted!: number
    workflowIds!: number[]
}
