import BaseData from '@sx/base-data'

export default interface TeamApiData extends BaseData {
    appUrl: string
    archived: boolean
    color: string
    colorKey: string
    description: string
    displayIcon: string
    entityType : string
    id: string
    memberIds: number[]
    mentionName: string
    name: string
    numEpicsStarted: number
    numStoriesStarted: number
    workflowIds: number[]
}
