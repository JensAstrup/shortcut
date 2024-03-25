export default interface TeamData {
    appUrl: string
    archived: boolean
    color: string
    colorKey: string
    description: string
    displayIcon: string
    entityType : string
    id: number
    memberIds: number[]
    mentionName: string
    name: string
    numEpicsStarted: number
    numStoriesStarted: number
    workflowIds: number[]
}