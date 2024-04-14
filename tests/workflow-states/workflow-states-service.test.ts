import {getHeaders} from '@sx/utils/headers'
import WorkflowStateInterface, {WorkflowStateType} from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'
import WorkflowStatesService from '@sx/workflow-states/workflow-states-service'
import Workflow from '@sx/workflows/workflow'
import WorkflowsService from '@sx/workflows/workflows-service'


describe('Workflow States Service', () => {
  it('should get a workflow state', async () => {
    const workflowStateInterface = {
      id: 1,
      name: 'test',
      type: WorkflowStateType.FINISHED,
      color: 'test',
      position: 1,
      workflowId: 1,
      createdAt: new Date('2021-01-01T00:00:00Z'),
      updatedAt: new Date('2021-01-01T00:00:00Z'),
      numStories: 1,
      numStoryTemplates: 1,
      entityType: 'workflowState',
      description: 'test',
      verb: 'test',
    } as WorkflowStateInterface
    jest.spyOn(WorkflowsService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [workflowStateInterface],
    }] as object as Workflow[])
    const workflowStateService = new WorkflowStatesService({headers: getHeaders()})
    const workflowState = await workflowStateService.get(1)
    expect(workflowState).toEqual(new WorkflowState(workflowStateInterface))
  })

  it('should throw an error if workflow state is not found', async () => {
    jest.spyOn(WorkflowsService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [],
    }] as object as Workflow[])
    const workflowStateService = new WorkflowStatesService({headers: getHeaders()})
    await expect(workflowStateService.get(2)).rejects.toThrow('Workflow state with id 2 not found')
  })

  it('should get many workflow states', async () => {
    const workflowStateInterface = {
      id: 1,
      name: 'test',
      type: WorkflowStateType.FINISHED,
      color: 'test',
      position: 1,
      workflowId: 1,
      createdAt: new Date('2021-01-01T00:00:00Z'),
      updatedAt: new Date('2021-01-01T00:00:00Z'),
      numStories: 1,
      numStoryTemplates: 1,
      entityType: 'workflowState',
      description: 'test',
      verb: 'test',
    } as WorkflowStateInterface
    jest.spyOn(WorkflowsService.prototype, 'list').mockResolvedValue([{
      id: 1,
      name: 'Test Workflow',
      states: [workflowStateInterface],
    }] as object as Workflow[])
    const workflowStateService = new WorkflowStatesService({headers: getHeaders()})
    const workflowState = await workflowStateService.getMany([1])
    expect(workflowState).toEqual([new WorkflowState(workflowStateInterface)])
  })
})
