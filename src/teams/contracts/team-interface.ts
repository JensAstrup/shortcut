import BaseInterface from '@sx/base-interface'


export default interface TeamInterface extends BaseInterface {
    appUrl: string
    archived: boolean
    color: string
    colorKey: string
    description: string
    displayIcon: string
    entityType: string
    id: string
    memberIds: number[]
    mentionName: string
    name: string
    numEpicsStarted: number
    numStoriesStarted: number
    workflowIds: number[]
}
