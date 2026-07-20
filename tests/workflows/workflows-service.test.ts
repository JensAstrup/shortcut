import WorkflowStateInterface from '../../src/workflow-states/contracts/workflow-state-interface'
import Workflow from '../../src/workflows/workflow'
import WorkflowService from '../../src/workflows/workflows-service'
import {stubHttp} from '../helpers/http'


describe('WorkflowService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should get workflow stats and return array', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 2, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])
    const service = new WorkflowService({http: stubHttp()})
    const expectedStates = [{id: 2, name: 'Test State'}]
    await expect(service.getWorkflowStates()).resolves.toEqual(expectedStates)
  })

  // WORKFLOW_STATES used to be a module-level cache shared by every service instance; a client
  // authenticated against one workspace could be served another's cached states. The cache is now
  // a WeakMap keyed by HTTP client, so it is still shared between service instances — deliberately,
  // since a service is constructed per `story.workflow` access — but only among those using the same
  // client. This asserts the caching behavior against one client rather than reaching into a global.
  it('should get workflow state from cached responses', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 123, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])
    const service = new WorkflowService({http: stubHttp()})

    await service.getWorkflowState(123)
    expect(WorkflowService.prototype.list).toHaveBeenCalledTimes(1)

    jest.mocked(WorkflowService.prototype.list).mockClear()
    await service.getWorkflowState(123)
    expect(WorkflowService.prototype.list).not.toHaveBeenCalled()
  })

  // The cache is only written once the list resolves, so without coalescing every concurrent first
  // lookup sees an empty cache and issues its own fetch. This is the realistic shape: a Promise.all
  // over several stories, each reading story.workflow.
  it('issues a single list request for concurrent cold-cache lookups', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 123, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])
    const service = new WorkflowService({http: stubHttp()})

    const states = await Promise.all([
      service.getWorkflowState(123),
      service.getWorkflowState(123),
      service.getWorkflowState(123)
    ])

    expect(WorkflowService.prototype.list).toHaveBeenCalledTimes(1)
    // Every caller still gets the resolved state, not just the one that won the race.
    states.forEach(state => {
      expect(state.id).toBe(123)
    })
  })

  it('retries after a failed population rather than caching the rejection', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockRejectedValueOnce(new Error('boom'))
    const service = new WorkflowService({http: stubHttp()})

    await expect(service.getWorkflowState(123)).rejects.toThrow('boom')

    // The in-flight entry is cleared on settle, so a later call starts a fresh request instead of
    // resolving against the stored rejection forever.
    jest.mocked(WorkflowService.prototype.list).mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 123, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])

    const state = await service.getWorkflowState(123)
    expect(state.id).toBe(123)
  })
})
