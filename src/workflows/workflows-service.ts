import BaseService, {ServiceOperation} from '@sx/base-service'
import {convertApiFields} from '@sx/utils/convert-fields'
import {WorkflowStateApiData} from '@sx/workflow-states/contracts/workflow-state-api-data'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowInterface from '@sx/workflows/contracts/workflow-interface'
import Workflow from '@sx/workflows/workflow'


const WORKFLOW_STATES: Record<number, WorkflowStateInterface> = {}

class WorkflowsService extends BaseService<Workflow, WorkflowInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/workflows'
  protected factory = (data: WorkflowInterface) => new Workflow(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  public async getWorkflowStates(): Promise<WorkflowStateInterface[]> {
    const workflows: Workflow[] = await this.list()
    const workflowStates: WorkflowStateInterface[] = this.extractWorkflowStates(workflows)

    for (const state of workflowStates) {
      WORKFLOW_STATES[state.id] = convertApiFields(state as unknown as WorkflowStateApiData) as WorkflowStateInterface
    }

    return workflowStates
  }

  private extractWorkflowStates(workflows: Workflow[]): WorkflowStateInterface[] {
    return workflows.reduce((acc: WorkflowStateInterface[], workflow) => {
      const states = workflow.states
      acc.push(...states)
      return acc
    }, [])
  }

  public async getWorkflowState(id: number): Promise<WorkflowStateInterface> {
    if (Object.keys(WORKFLOW_STATES).length === 0) {
      await this.getWorkflowStates()
    }
    return WORKFLOW_STATES[id]
  }
}

export default WorkflowsService
export {WORKFLOW_STATES}
