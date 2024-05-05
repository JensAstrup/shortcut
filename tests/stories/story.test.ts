import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import Epic from '@sx/epics/epic'
import EpicsService from '@sx/epics/epics-service'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'
import Iteration from '@sx/iterations/iteration'
import IterationsService from '@sx/iterations/iterations-service'
import Label from '@sx/labels/label'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import History from '@sx/stories/history/history'
import Story from '@sx/stories/story'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import UploadedFilesService from '@sx/uploaded-files/uploaded-files-service'
import {convertApiFields} from '@sx/utils/convert-fields'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowState from '@sx/workflow-states/workflow-state'
import WorkflowService from '@sx/workflows/workflows-service'


const axiosMock = new AxiosMockAdapter(axios)


describe('Story', () => {
  process.env.SHORTCUT_API_KEY = 'token'
  beforeEach(() => {
    axiosMock.reset()
  })

  it('should instantiate comments', () => {
    const story = new Story({id: 1, comments: [{id: 1, text: 'Test comment'}]})
    expect(story.comments[0].text).toEqual('Test comment')
  })

  it('should instantiate tasks', () => {
    const story = new Story({id: 1, tasks: [{id: 1, description: 'Test task'}]})
    expect(story.tasks[0].description).toEqual('Test task')
  })

  it('should instantiate story links', () => {
    const story = new Story({id: 1, storyLinks: [{id: 1, verb: 'blocks', objectId: 2}]})
    expect(story.storyLinks[0].verb).toEqual('blocks')
    expect(story.storyLinks[0].objectId).toEqual(2)
  })

  it('should instantiate story labels', () => {
    const story = new Story({id: 1, labels: [{id: 1, name: 'Test label'}]})
    expect(story.labels[0].name).toEqual('Test label')
    expect(story.labels[0]).toBeInstanceOf(Label)
  })

  it('should set labels and update changedFields', () => {
    const story = new Story({id: 1})
    story.labels = [{id: 1, name: 'Test label'} as Label]
    expect(story.labels[0].name).toEqual('Test label')
    expect(story.changedFields).toContain('labels')
  })

  describe('workflow getter', () => {
    it('should return workflow state by ID', () => {
      const story = new Story({workflowStateId: 1})
      jest.spyOn(WorkflowService.prototype, 'getWorkflowState').mockReturnValue({
        id: 1,
        name: 'Unstarted'
      } as object as Promise<WorkflowState>)
      expect(story.workflow).toEqual({id: 1, name: 'Unstarted'})
      expect(WorkflowService.prototype.getWorkflowState).toHaveBeenCalledWith(1)
    })
  })

  describe('state method', () => {
    it('should return workflow state by ID', async () => {
      const story = new Story({workflowStateId: 1})
      jest.spyOn(WorkflowService.prototype, 'getWorkflowState').mockReturnValue({
        id: 1,
        type: 'Unstarted'
      } as object as Promise<WorkflowState>)
      expect(await story.state()).toEqual('Unstarted')
    })
  })

  describe('iteration getter', () => {
    it('returns null if story does not have an iteration', async () => {
      const story = new Story({iterationId: null})
      await expect(story.iteration).toBeNull()
    })

    it('returns an iteration if story has an iteration ID', async () => {
      const iterationData: IterationInterface = {id: 1, name: 'Test iteration'} as unknown as IterationInterface
      const iteration: Iteration = new Iteration(iterationData)
      jest.spyOn(IterationsService.prototype, 'get').mockResolvedValue(iteration)
      const story = new Story({iterationId: 1})
      const result = await story.iteration
      expect(result).toEqual(iteration)
    })
  })

  describe('team getter', () => {
    it('returns null if no team ID is set', () => {
      const story = new Story({groupId: null})
      expect(story.team).toBeNull()
    })

    it('should return the team object', () => {
      const teamData = {id: 1, name: 'Test team'} as object as Team
      jest.spyOn(TeamsService.prototype, 'get').mockReturnValue(teamData as object as Promise<Team>)
      const story = new Story({groupId: 1})
      expect(story.team).toEqual(teamData)
      expect(TeamsService.prototype.get).toHaveBeenCalledWith(1)
    })
  })

  describe('owner getter', () => {
    it('should return an array of members', () => {
      const story = new Story({ownerIds: [1, 2]})
      const users = [{id: 1, name: 'Test user 1'}, {
        id: 2,
        name: 'Test user 2'
      }]
      jest.spyOn(MembersService.prototype, 'getMany').mockReturnValue(users as object as Promise<Member[]>)
      expect(story.owners).toEqual([{id: 1, name: 'Test user 1'}, {
        id: 2,
        name: 'Test user 2'
      }])
    })
  })

  describe('epic getter', () => {
    it('returns null if no epic ID is set', () => {
      const story = new Story({epicId: null})
      expect(story.epic).toBeNull()
    })
    it('should return the epic object', () => {
      const epicData = {id: 1, name: 'Test epic'}
      jest.spyOn(EpicsService.prototype, 'get').mockReturnValue(epicData as object as Promise<Epic>)
      const story = new Story({epicId: 1})
      expect(story.epic).toEqual(epicData)
      expect(EpicsService.prototype.get).toHaveBeenCalledWith(1)
    })
  })

  describe('history method', () => {
    it('should throw an error if request fails', () => {
      const story = new Story({id: 1})
      axiosMock.onGet().reply(500)
      expect(story.history()).rejects.toThrow('Error fetching history: Error: Request failed with status code 500')
    })

    it('should return the story history', async () => {
      const story = new Story({id: 1})
      const history = [{id: 1}]
      axiosMock.onGet().reply(200, history)
      const storyHistory = await story.history()
      expect(storyHistory[0]).toMatchObject(history[0])
    })
  })

  describe('workflowHistory method', () => {
    it('should return the story workflow history', async () => {
      const story = new Story({id: 1})
      const getWorkflowHistory = jest.fn().mockResolvedValue([{id: 1} as object as WorkflowStateInterface])
      const history = [{id: 1, getWorkflowHistory: getWorkflowHistory}]
      jest.spyOn(Story.prototype, 'history').mockResolvedValue(history as object as Promise<History[]>)
      axiosMock.onGet().reply(200, history)
      await story.workflowHistory()
      expect(getWorkflowHistory).toHaveBeenCalled()
    })
  })

  describe('cycleTime method', () => {
    it(' should throw an error if start date is not set', () => {
      const story = new Story({id: 1, startedAt: null, completedAt: null})
      expect(() => story.cycleTime()).toThrow('Story does not have a cycle time')
    })

    it('should throw an error if completed date is not set', () => {
      const story = new Story({id: 1, startedAt: new Date('2021-01-01')})
      expect(() => story.cycleTime()).toThrow('Story does not have a cycle time')
    })

    it('should return the cycle time', () => {
      const startedAt = new Date('2021-01-01')
      const completedAt = new Date('2021-01-05')
      const story = new Story({id: 1, startedAt: startedAt, completedAt: completedAt})
      expect(story.cycleTime()).toEqual(4 * 24)
    })
  })

  describe('timeInDevelopment method', () => {
    const mockedDate = new Date('2022-03-28')
    const realDate = Date

    beforeEach(() => {
      global.Date = jest.fn(() => mockedDate) as unknown as typeof Date
      global.Date.now = realDate.now
    })

    afterEach(() => {
      global.Date = realDate
    })


    it('should throw an error if workflow state is finished', () => {
      jest.spyOn(WorkflowService.prototype, 'getWorkflowState').mockReturnValue({
        id: 1,
        type: 'Finished'
      } as unknown as Promise<WorkflowState>)
      const story = new Story({id: 1, workflowStateId: 1})
      expect(story.timeInDevelopment()).rejects.toThrow('Story is already finished')
    })

    it('should throw an error if story does not have a started date', () => {
      jest.spyOn(WorkflowService.prototype, 'getWorkflowState').mockReturnValue({
        id: 1,
        type: 'Started'
      } as object as Promise<WorkflowState>)
      const story = new Story({id: 1, startedAt: null})
      expect(story.timeInDevelopment()).rejects.toThrow('Story is not started')
    })

    it('should return the time in development', async () => {
      const mockWorkflow = {type: 'SomeWorkflowType'}
      const mockStartedAt = new Date('2021-01-01')

      jest.spyOn(Story.prototype, 'workflow', 'get').mockResolvedValue(mockWorkflow as object as Promise<WorkflowStateInterface>)

      const story = new Story({id: 1, workflowStateId: 1, startedAt: null})
      story.startedAt = mockStartedAt
      const expectedTimeInDevelopment = (mockedDate.getTime() - mockStartedAt.getTime()) / (1000 * 60 * 60)
      await expect(story.timeInDevelopment()).resolves.toEqual(expectedTimeInDevelopment)
    })
  })

  describe('comment method', () => {
    it('successfully posts a comment and returns the story comment object', async () => {
      const commentData = {text: 'Test comment'}
      axiosMock.onPost().reply(200, commentData)

      const story = new Story({id: 1})
      const result = await story.comment('Test comment')

      expect(result).toMatchObject(convertApiFields(commentData))
    })

    it('throws an error if the axios request fails', async () => {
      axiosMock.onPost().reply(500)
      const story = new Story({id: 1}) // Adjust initial data as needed

      await expect(story.comment('Test comment')).rejects.toThrow('Error creating comment: Error: Request failed with status code 500')
    })
  })

  describe('addFile method', () => {
    it('should upload file using UploadedFilesService and return result', async () => {
      const service = jest.spyOn(UploadedFilesService.prototype, 'upload')
      service.mockResolvedValue({id: 1, filename: 'test.jpg'} as object as Promise<UploadedFile>)
      const story = new Story({id: 1})
      const result = await story.addFile('test.jpg' as unknown as Buffer)
      expect(result).toEqual({id: 1, filename: 'test.jpg'})
    })
  })

  describe('addTasks method', () => {
    it('should post task data and add new task to tasks property', async () => {
      const taskData = {description: 'Test task'}
      axiosMock.onPost().reply(200, taskData)

      const story = new Story({id: 1, tasks: []})
      await story.addTask('Test task')

      expect(story.tasks[0].description).toEqual('Test task')
    })

    it('should throw an error if the axios request fails', async () => {
      axiosMock.onPost().reply(500)
      const story = new Story({id: 1, tasks: []})

      await expect(story.addTask('Test task')).rejects.toThrow('Error adding task: Error: Request failed with status code 500')
    })
  })

  describe('blocks method', () => {
    it('should add blocking story with number argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.blocks(2)
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('blocks')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })

    it('should add blocking story with story object argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.blocks(new Story({id: 2}))
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('blocks')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })
  })

  describe('duplicated method', () => {
    it('should add duplicated story with number argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.duplicates(2)
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('duplicates')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })

    it('should add duplicated story with story object argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.duplicates(new Story({id: 2}))
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('duplicates')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })
  })

  describe('relatedTo method', () => {
    it('should add related story with number argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.relatesTo(2)
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('relates to')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })

    it('should add related story with story object argument', async () => {
      axiosMock.onPost().reply(200, {data: {id: 2}})
      const story = new Story({id: 1, storyLinks: []})
      await story.relatesTo(new Story({id: 2}))
      expect(story.storyLinks[0].objectId).toEqual(1)
      expect(story.storyLinks[0].verb).toEqual('relates to')
      expect(story.storyLinks[0].subjectId).toEqual(2)
    })
  })
})
