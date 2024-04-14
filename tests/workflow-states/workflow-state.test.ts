import WorkflowStateInterface, {WorkflowStateType} from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'


describe('WorkflowState', () => {
  it('should instantiate', () => {
    const workflowData: WorkflowStateInterface = {
      color: 'red',
      createdAt: new Date(),
      description: 'test',
      entityType: 'test',
      id: 1,
      name: 'test',
      numStories: 1,
      numStoryTemplates: 1,
      position: 1,
      type: WorkflowStateType.STARTED,
      updatedAt: new Date(),
      verb: 'test'
    }
    const workflowState = new WorkflowState(workflowData)
    expect(workflowState).toBeInstanceOf(WorkflowState)
    expect(workflowState.type).toBe(WorkflowStateType.STARTED)
    expect(workflowState.color).toBe('red')
    expect(workflowState.createdAt).toBeInstanceOf(Date)
    expect(workflowState.description).toBe('test')
    expect(workflowState.entityType).toBe('test')
    expect(workflowState.id).toBe(1)
    expect(workflowState.name).toBe('test')
    expect(workflowState.numStories).toBe(1)
    expect(workflowState.numStoryTemplates).toBe(1)
    expect(workflowState.position).toBe(1)
    expect(workflowState.updatedAt).toBeInstanceOf(Date)
    expect(workflowState.verb).toBe('test')
  })
})
