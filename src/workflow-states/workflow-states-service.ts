import {AxiosInstance} from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'
import Workflow from '@sx/workflows/workflow'
import WorkflowsService from '@sx/workflows/workflows-service'


/**
 * Workflows keyed by the HTTP client that fetched them. Previously module-level globals, which leaked
 * one workspace's workflows to clients authenticated against another; keying on the client keeps
 * clients isolated without giving up the cache that spares a full workflow fetch per lookup.
 */
const WORKFLOWS_BY_CLIENT = new WeakMap<AxiosInstance, Workflow[]>()

/**
 * There are no API endpoints for workflow states, so we need to get the workflows and filter the state attributes from there
 */
class WorkflowStatesService extends BaseService<WorkflowState, WorkflowStateInterface> {
  public baseUrl = ''
  protected factory = (data: object): WorkflowState => new WorkflowState(data as WorkflowStateInterface)
  public availableOperations: ServiceOperation[] = []

  private get workflowStates(): WorkflowStateInterface[] {
    return (WORKFLOWS_BY_CLIENT.get(this.http) ?? []).map(workflow => workflow.states).flat()
  }

  async populateWorkflows(): Promise<void> {
    const service: WorkflowsService = new WorkflowsService({http: this.http})
    WORKFLOWS_BY_CLIENT.set(this.http, await service.list())
  }

  async get(id: number): Promise<WorkflowState> {
    if (!this.workflowStates.length) await this.populateWorkflows()
    const match: WorkflowStateInterface | undefined = this.workflowStates.find(workflowState => workflowState.id === id)
    if (!match) throw new Error(`Workflow state with id ${id} not found`)
    return this.build(match)
  }

  async getMany(ids: number[]): Promise<WorkflowState[]> {
    if (!this.workflowStates.length) await this.populateWorkflows()
    const matchingStates: Array<WorkflowStateInterface> = this.workflowStates.filter((workflowState: WorkflowStateInterface)  => ids.includes(workflowState.id))
    return matchingStates.map((workflowState: WorkflowStateInterface) => this.build(workflowState))
  }
}

export default WorkflowStatesService
