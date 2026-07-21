import BaseCreateData from '@sx/base-create-data'


interface CreateTeamData extends BaseCreateData {
    color?: string
    colorKey?: string
    description?: string
    displayIcon?: string
    memberIds?: number[]
    mentionName: string
    name: string
    workflowIds?: number[]
}

export { CreateTeamData as default }

