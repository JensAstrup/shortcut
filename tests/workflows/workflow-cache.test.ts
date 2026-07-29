import AxiosMockAdapter from 'axios-mock-adapter'

import Story from '@sx/stories/story'
import {createHttpClient} from '@sx/utils/http'
import WorkflowStatesService from '@sx/workflow-states/workflow-states-service'


/**
 * `story.workflow`/`story.state` now retrieve a single workflow by ID (`GET /workflows/{id}`),
 * building a short-lived `WorkflowsService` per access, so there is no cross-call caching for these
 * accessors (matching `epic`/`team`). `WorkflowStatesService`, by contrast, still lists every workflow
 * once and caches it per HTTP client via a module-level `WeakMap` — that cache is what the last test
 * below exercises.
 */
describe('workflow and workflow state retrieval', () => {
  function workflowRequestsFor(mock: AxiosMockAdapter, id: number): number {
    return mock.history.get.filter(request => request.url === `/workflows/${id}`).length
  }

  it('fetches the workflow by ID for both the workflow and state getters', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onGet('/workflows/1').reply(200, {id: 1, name: 'wf', states: [{id: 10, name: 'Ready', type: 'Started'}]})
    const story = new Story({id: 1, workflowId: 1, workflowStateId: 10}).setHttp(http)

    const workflow = await story.workflow
    const state = await story.state

    expect(workflow.name).toEqual('wf')
    expect(state.name).toEqual('Ready')
    expect(workflowRequestsFor(mock, 1)).toEqual(2)
  })

  it('does not serve one client\'s workflow to another', async () => {
    const a = createHttpClient('key-a')
    const b = createHttpClient('key-b')
    const mockA = new AxiosMockAdapter(a)
    const mockB = new AxiosMockAdapter(b)
    mockA.onGet('/workflows/1').reply(200, {id: 1, name: 'wfA', states: [{id: 10, name: 'A-state', type: 'Started'}]})
    mockB.onGet('/workflows/2').reply(200, {id: 2, name: 'wfB', states: [{id: 10, name: 'B-state', type: 'Done'}]})

    const fromA = await new Story({id: 1, workflowId: 1, workflowStateId: 10}).setHttp(a).state
    const fromB = await new Story({id: 2, workflowId: 2, workflowStateId: 10}).setHttp(b).state

    expect(fromA.name).toEqual('A-state')
    expect(fromB.name).toEqual('B-state')
  })

  it('shares the cache between separate WorkflowStatesService instances on one client', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onGet('/workflows').reply(200, [{id: 1, name: 'wf', states: [{id: 10, name: 'Ready', type: 'Started'}]}])

    await new WorkflowStatesService({http}).get(10)
    await new WorkflowStatesService({http}).get(10)

    expect(mock.history.get.filter(request => request.url === '/workflows').length).toEqual(1)
  })
})
