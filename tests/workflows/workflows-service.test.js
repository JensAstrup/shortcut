import WorkflowService, {WORKFLOW_STATES} from '../../src/workflows/workflows-service'


describe('WorkflowService', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })
  it('should get workflow stats and return array', () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 'UUID1',
      name: 'Test Workflow',
      states: [{id: 'UUID2', name: 'Test State'}]
    }])
    const service = new WorkflowService({headers: {}})
    const expectedStates = [{id: 'UUID2', name: 'Test State'}]
    expect(service.getWorkflowStates()).resolves.toEqual(expectedStates)
  })

  it('should get workflow state from cached responses', async () => {
    jest.spyOn(WorkflowService.prototype, 'list').mockResolvedValue([{
      id: 'UUID1',
      name: 'Test Workflow',
      states: [{id: 'UUID2', name: 'Test State'}]
    }])
    WORKFLOW_STATES[123] = {
      id: 123,
      name: 'Test State',
      color: 'red',
      type: 'Unstarted',
      createdAt: new Date(),
      description: 'Test Description',
      entityType: 'Story',
      position: 1,
      verb: 'Test Verb',
      numStories: 1,
      numStoryTemplates: 1,
      updatedAt: new Date(),
      appUrl: 'http://test.com'
    }
    const service = new WorkflowService({headers: {}})
    await service.getWorkflowState(123)
    expect(WorkflowService.prototype.list).not.toHaveBeenCalled()
  })
})
