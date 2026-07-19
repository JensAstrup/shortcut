import WorkflowStateInterface from '../../src/workflow-states/contracts/workflow-state-interface'
import Workflow from '../../src/workflows/workflow'
import WorkflowService from '../../src/workflows/workflows-service'
import {stubHttp} from '../helpers/http'


describe('WorkflowService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should get workflow stats and return array', () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 2, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])
    const service = new WorkflowService({http: stubHttp()})
    const expectedStates = [{id: 2, name: 'Test State'}]
    expect(service.getWorkflowStates()).resolves.toEqual(expectedStates)
  })

  // WORKFLOW_STATES used to be a module-level cache shared by every service instance; a client
  // authenticated against one workspace could be served another's cached states. The cache is now
  // a private field per instance, so this asserts the caching behavior directly against one
  // instance rather than reaching into a global.
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
})
