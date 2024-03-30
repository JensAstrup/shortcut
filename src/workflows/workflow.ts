import ShortcutResource from '@sx/base-resource'
import {WorkflowStateInterface} from '@sx/workflows/contracts/workflow-state-interface'


/**
 * @inheritDoc
 */
export default class Workflow extends ShortcutResource {
    autoAssignOwner!: boolean
    createdAt!: Date
    defaultStateId!: number
    description!: string
    entityType!: string
    id!: number
    name!: string
    projectIds!: number[]
    states!: WorkflowStateInterface[]
    teamId!: number
    updatedAt!: Date
}
