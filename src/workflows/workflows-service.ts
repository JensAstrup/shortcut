import {AxiosInstance} from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import {convertApiFields} from '@sx/utils/convert-fields'
import {WorkflowStateApiData} from '@sx/workflow-states/contracts/workflow-state-api-data'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowInterface from '@sx/workflows/contracts/workflow-interface'
import Workflow from '@sx/workflows/workflow'


/**
 * Workflow states keyed by the HTTP client that fetched them.
 *
 * There is no endpoint for a single workflow state, so resolving one costs a full workflow list
 * fetch; caching it matters. This was previously a module-level object, which leaked one workspace's
 * states to clients authenticated against another. Keying on the client keeps clients isolated while
 * still letting the short-lived services built per `story.workflow` access share a cache. A WeakMap
 * so the cache is collected along with the client.
 */
const WORKFLOW_STATES_BY_CLIENT = new WeakMap<AxiosInstance, Record<number, WorkflowStateInterface>>()

/**
 * In-flight population requests, keyed by client.
 *
 * The cache above is only written once `/workflows` resolves, so concurrent first lookups — the
 * common case, since `Promise.all` over several stories each reads `story.workflow` — would all
 * observe an empty cache and each issue the same full-list fetch. Callers share the first request
 * instead. Cleared on settle so a failed fetch does not poison later attempts.
 */
const POPULATION_BY_CLIENT = new WeakMap<AxiosInstance, Promise<WorkflowStateInterface[]>>()

class WorkflowsService extends BaseService<Workflow, WorkflowInterface> {
  public baseUrl = '/workflows'
  protected factory = (data: WorkflowInterface): Workflow => new Workflow(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  private get workflowStates(): Record<number, WorkflowStateInterface> {
    let cached = WORKFLOW_STATES_BY_CLIENT.get(this.http)
    if (!cached) {
      cached = {}
      WORKFLOW_STATES_BY_CLIENT.set(this.http, cached)
    }
    return cached
  }

  public async getWorkflowStates(): Promise<WorkflowStateInterface[]> {
    const workflows: Workflow[] = await this.list()
    const workflowStates: WorkflowStateInterface[] = this.extractWorkflowStates(workflows)

    const cache = this.workflowStates
    for (const state of workflowStates) {
      cache[state.id] = convertApiFields<WorkflowStateApiData, WorkflowStateInterface>(state as unknown as WorkflowStateApiData)
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

  /**
   * Populates the state cache, reusing an already-running fetch for the same client rather than
   * starting a second one.
   */
  private populateWorkflowStates(): Promise<WorkflowStateInterface[]> {
    const inFlight = POPULATION_BY_CLIENT.get(this.http)
    if (inFlight) {
      return inFlight
    }
    // The stored promise is the one returned, so every caller settles on the same result, and the
    // entry is removed on settle whether it resolved or rejected.
    const request = this.getWorkflowStates().finally(() => {
      POPULATION_BY_CLIENT.delete(this.http)
    })
    POPULATION_BY_CLIENT.set(this.http, request)
    return request
  }

  public async getWorkflowState(id: number): Promise<WorkflowStateInterface> {
    if (Object.keys(this.workflowStates).length === 0) {
      await this.populateWorkflowStates()
    }
    return this.workflowStates[id]
  }
}

export default WorkflowsService
