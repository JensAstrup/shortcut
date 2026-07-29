import {ResourceBaseFor} from '@sx/base-resource'
import WorkflowStateInterface, {WorkflowStateType} from '@sx/workflow-states/contracts/workflow-state-interface'


class WorkflowState extends ResourceBaseFor<WorkflowStateInterface>() implements WorkflowStateInterface {
  constructor(init: WorkflowStateInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  color: string
  createdAt: Date
  description: string
  entityType: string
  id: number
  name: string
  numStories: number
  numStoryTemplates: number
  position: number
  type: WorkflowStateType
  updatedAt: Date
  verb: string | null
}

export default WorkflowState
