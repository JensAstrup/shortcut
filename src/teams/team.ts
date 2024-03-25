import ShortcutResource from '@sxbase-resource'


export default class TeamResource extends ShortcutResource {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/groups' // Shortcut renamed groups to teams
    public createFields: string[] = ['name', 'mentionName']

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