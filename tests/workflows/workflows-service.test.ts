import WorkflowStateInterface, {WorkflowStateType} from '../../src/workflow-states/contracts/workflow-state-interface'
import Workflow from '../../src/workflows/workflow'
import WorkflowService, {WORKFLOW_STATES} from '../../src/workflows/workflows-service'


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
    const service = new WorkflowService({headers: {}})
    const expectedStates = [{id: 2, name: 'Test State'}]
    expect(service.getWorkflowStates()).resolves.toEqual(expectedStates)
  })

  it('should get workflow state from cached responses', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [{id: 2, name: 'Test State'} as unknown as WorkflowStateInterface]
    } as Workflow])
    WORKFLOW_STATES[123] = {
      id: 123,
      name: 'Test State',
      color: 'red',
      type: WorkflowStateType.UNSTARTED,
      createdAt: new Date(),
      description: 'Test Description',
      entityType: 'Story',
      position: 1,
      verb: 'Test Verb',
      numStories: 1,
      numStoryTemplates: 1,
      updatedAt: new Date(),
    }
    const service = new WorkflowService({headers: {}})
    await service.getWorkflowState(123)
    expect(WorkflowService.prototype.list).not.toHaveBeenCalled()
  })
})
