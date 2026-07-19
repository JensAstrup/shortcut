import BaseInterface from '@sx/base-interface'
import EpicWorkflowStateInterface from '@sx/epics/workflows/contracts/epic-workflow-state-interface'


interface EpicWorkflowInterface extends BaseInterface {
    createdAt: Date
    defaultEpicStateId: number
    entityType: string
    epicStates: EpicWorkflowStateInterface[]
    id: number
    updatedAt: Date
}

export { EpicWorkflowInterface as default }

