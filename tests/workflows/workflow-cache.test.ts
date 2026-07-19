import AxiosMockAdapter from 'axios-mock-adapter'

import Story from '@sx/stories/story'
import {createHttpClient} from '@sx/utils/http'
import WorkflowStatesService from '@sx/workflow-states/workflow-states-service'


/**
 * Resolving a single workflow state costs a full workflow list fetch, and short-lived services are
 * built per lookup (`story.workflow` constructs a new WorkflowsService on every access). The cache is
 * therefore keyed on the HTTP client: shared across services built from the same client, never shared
 * between clients authenticated against different workspaces.
 */
describe('workflow state caching', () => {
  const workflowsFor = (mock: AxiosMockAdapter): number =>
    mock.history.get.filter(request => request.url === '/workflows').length

  it('fetches the workflow list once across repeated lookups on one client', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onGet('/workflows').reply(200, [{id: 1, name: 'wf', states: [{id: 10, name: 'Ready', type: 'Started'}]}])
    const story = new Story({id: 1, workflowStateId: 10}).setHttp(http)

    await story.workflow
    await story.workflow
    await story.workflow

    expect(workflowsFor(mock)).toEqual(1)
  })

  it('does not serve one client\'s workflow states to another', async () => {
    const a = createHttpClient('key-a')
    const b = createHttpClient('key-b')
    const mockA = new AxiosMockAdapter(a)
    const mockB = new AxiosMockAdapter(b)
    mockA.onGet('/workflows').reply(200, [{id: 1, name: 'wfA', states: [{id: 10, name: 'A-state', type: 'Started'}]}])
    mockB.onGet('/workflows').reply(200, [{id: 2, name: 'wfB', states: [{id: 10, name: 'B-state', type: 'Done'}]}])

    const fromA = await new Story({id: 1, workflowStateId: 10}).setHttp(a).workflow
    const fromB = await new Story({id: 2, workflowStateId: 10}).setHttp(b).workflow

    expect(fromA.name).toEqual('A-state')
    expect(fromB.name).toEqual('B-state')
    expect(workflowsFor(mockA)).toEqual(1)
    expect(workflowsFor(mockB)).toEqual(1)
  })

  it('shares the cache between separate WorkflowStatesService instances on one client', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onGet('/workflows').reply(200, [{id: 1, name: 'wf', states: [{id: 10, name: 'Ready', type: 'Started'}]}])

    await new WorkflowStatesService({http}).get(10)
    await new WorkflowStatesService({http}).get(10)

    expect(workflowsFor(mock)).toEqual(1)
  })
})
