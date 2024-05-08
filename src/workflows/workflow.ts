import BaseResource from '@sx/base-resource'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowInterface from '@sx/workflows/contracts/workflow-interface'


/**
 * @inheritDoc
 */
export default class Workflow extends BaseResource<WorkflowInterface> implements WorkflowInterface {
  constructor(init: object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  autoAssignOwner: boolean
  createdAt: Date
  defaultStateId: number
  description: string
  entityType: string
  id: number
  name: string
  projectIds: number[]
  states: WorkflowStateInterface[]
  teamId: number
  updatedAt: Date
}
