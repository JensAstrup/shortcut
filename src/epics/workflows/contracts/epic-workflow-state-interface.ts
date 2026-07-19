import BaseInterface from '@sx/base-interface'


interface EpicWorkflowStateInterface extends BaseInterface {
    color: string
    createdAt: Date
    description: string
    entityType: string
    id: number
    name: string
    position: number
    type: string
    updatedAt: Date
}

export { EpicWorkflowStateInterface as default }

