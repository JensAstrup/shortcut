import BaseService, {ServiceOperation} from '@sx/base-service'
import {getHeaders} from '@sx/utils/headers'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'
import Workflow from '@sx/workflows/workflow'
import WorkflowsService from '@sx/workflows/workflows-service'


let WORKFLOWS: Workflow[] = []
let WORKFLOW_STATES: WorkflowStateInterface[] = []

/**
 * There are no API endpoints for workflow states, so we need to get the workflows and filter the state attributes from there
 */
class WorkflowStatesService extends BaseService<WorkflowState, WorkflowStateInterface> {
  public baseUrl = ''
  protected factory = (data: object) => new WorkflowState(data as WorkflowStateInterface)
  public availableOperations: ServiceOperation[] = []

  async populateWorkflows() {
    const service: WorkflowsService = new WorkflowsService({headers: getHeaders()})
    WORKFLOWS = await service.list()
    WORKFLOW_STATES = WORKFLOWS.map(workflow => workflow.states).flat()
  }

  async get(id: number): Promise<WorkflowState> {
    if (!WORKFLOW_STATES.length) await this.populateWorkflows()
    const match: WorkflowStateInterface | undefined = WORKFLOW_STATES.find(workflowState => workflowState.id === id)
    if (!match) throw new Error(`Workflow state with id ${id} not found`)
    return new WorkflowState(match)
  }

  async getMany(ids: number[]): Promise<WorkflowState[]> {
    if (!WORKFLOW_STATES.length) await this.populateWorkflows()
    const matchingStates: Array<WorkflowStateInterface> = WORKFLOW_STATES.filter((workflowState: WorkflowStateInterface)  => ids.includes(workflowState.id))
    return matchingStates.map((workflowState: WorkflowStateInterface) => new WorkflowState(workflowState))
  }
}

export default WorkflowStatesService
