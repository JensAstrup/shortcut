import BaseService, {ServiceOperation} from '@sx/base-service'
import {getHeaders} from '@sx/utils/headers'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'
import Workflow from '@sx/workflows/workflow'
import WorkflowsService from '@sx/workflows/workflows-service'


let workflows: Workflow[] = []
let workflowStates: WorkflowStateInterface[] = []

/**
 * There are no API endpoints for workflow states, so we need to get the workflows and filter the state attributes from there
 */
class WorkflowStatesService extends BaseService<WorkflowState, WorkflowStateInterface> {
  public baseUrl = ''
  protected factory = (data: object) => new WorkflowState(data as WorkflowStateInterface)
  public availableOperations: ServiceOperation[] = []

  async populateWorkflows() {
    const service = new WorkflowsService({headers: getHeaders()})
    workflows = await service.list()
    workflowStates = workflows.map(workflow => workflow.states).flat()
  }

  async get(id: number): Promise<WorkflowState> {
    if (!workflowStates.length) await this.populateWorkflows()
    const match = workflowStates.find(workflowState => workflowState.id === id)
    if (!match) throw new Error(`Workflow state with id ${id} not found`)
    return new WorkflowState(match)
  }

  async getMany(ids: number[]): Promise<WorkflowState[]> {
    if (!workflowStates.length) await this.populateWorkflows()
    const matchingStates = workflowStates.filter(workflowState  => ids.includes(workflowState.id))
    return matchingStates.map(workflowState => new WorkflowState(workflowState))
  }
}

export default WorkflowStatesService
