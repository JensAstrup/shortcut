import axios from 'axios'
import Story from '../../src/stories/story'
import {convertApiFields} from '../../src/utils/convert-fields'
import {getHeaders} from '../../src/utils/headers'
import Iteration from '../../src/iterations/iteration'
import WorkflowService from '../../src/workflows/workflows-service'
import TeamService from '../../src/teams/team-service'
import MembersService from '../../src/members/members-service'
import EpicsService from '../../src/epics/epics-service'


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}))

describe('Story', () => {
    process.env.SHORTCUT_API_KEY = 'token'
    beforeEach(() => {
        axios.post.mockClear()
    })

    describe('workflow getter', () => {
        it('should return workflow state by ID', () => {
            const story = new Story({workflowStateId: 1})
            jest.spyOn(WorkflowService, 'getWorkflowState').mockReturnValue({id: 1, name: 'Unstarted'})
            expect(story.workflow).toEqual({id: 1, name: 'Unstarted'})
            expect(WorkflowService.getWorkflowState).toHaveBeenCalledWith(1)
        })
    })

    describe('iteration getter', () => {
        it('throws an error if story does not have an iteration', async () => {
            const story = new Story({iterationId: null}) // Adjust initial data as needed
            await expect(async () => story.iteration).rejects.toThrow('Story does not have an iteration')
        })

        it('returns an iteration if story has an iteration ID', async () => {
            const iterationData = {id: 1, name: 'Test iteration'}
            const iteration = new Iteration(iterationData)
            axios.get.mockResolvedValue({data: iterationData})
            const story = new Story({iterationId: 1})
            const result = await story.iteration
            expect(result).toEqual(iteration)
        });
    })

    describe('team getter', () => {
        it('should throw an error if no team ID is set', () => {
            const story = new Story({groupId: null})
            expect(() => story.team).toThrow('Story does not have a team')
        })

        it('should return the team object', () => {
            const teamData = {id: 1, name: 'Test team'}
            jest.spyOn(TeamService.prototype, 'get').mockReturnValue(teamData)
            const story = new Story({groupId: 1})
            expect(story.team).toEqual(teamData)
            expect(TeamService.prototype.get).toHaveBeenCalledWith(1)
        })
    })

    describe('owner getter', () => {
        it('should return an array of members', () => {
            const story = new Story({ownerIds: [1, 2]})
            const users = [{id: 1, name: 'Test user 1'}, {
                id: 2,
                name: 'Test user 2'
            }]
            jest.spyOn(MembersService.prototype, 'getMany').mockReturnValue(users)
            expect(story.owners).toEqual([{id: 1, name: 'Test user 1'}, {id: 2, name: 'Test user 2'}])
        })
    })

    describe('epic getter', () => {
        it('should throw an error if no epic ID is set', () => {
            const story = new Story({epicId: null})
            expect(() => story.epic).toThrow('Story does not have an epic')
        })
        it('should return the epic object', () => {
            const epicData = {id: 1, name: 'Test epic'}
            jest.spyOn(EpicsService.prototype, 'get').mockReturnValue(epicData)
            const story = new Story({epicId: 1})
            expect(story.epic).toEqual(epicData)
            expect(EpicsService.prototype.get).toHaveBeenCalledWith(1)
        })
    })

    describe('history method', () => {
        it('should throw an error if request fails', () => {
            const story = new Story({id: 1})
            axios.get.mockRejectedValue(new Error('Network error'))
            expect(story.history()).rejects.toThrow('Error fetching history: Error: Network error')
        })

        it('should return the story history', () => {
            const story = new Story({id: 1})
            const history = [{id: 1, name: 'Test history'}]
            axios.get.mockResolvedValue({data: history})
            expect(story.history()).resolves.toEqual(history)
            expect(axios.get).toHaveBeenCalledWith(`${Story.baseUrl}/stories/${story.id}/history`, {headers: getHeaders()})
        })
    })

    describe('cycleTime method', () => {
        it('should throw an error if start date is not set', () => {
            const story = new Story({id: 1, startedAt: null, completedAt: null})
            expect(story.cycleTime()).rejects.toThrow('Story does not have a cycle time')
        })

        it('should throw an error if completed date is not set', () => {
            const story = new Story({id: 1, startedAt: new Date('2021-01-01')})
            expect(() => story.cycleTime()).rejects.toThrow('Story does not have a cycle time')
        })

        it('should return the cycle time', () => {
            const startedAt = new Date('2021-01-01')
            const completedAt = new Date('2021-01-05')
            const story = new Story({id: 1, startedAt: startedAt, completedAt: completedAt})
            expect(story.cycleTime()).resolves.toEqual(4 * 24)
        })
    })

    describe('timeInDevelopment method', () => {
        const mockedDate = new Date('2022-03-28')
        const realDate = Date

        beforeEach(() => {
            global.Date = jest.fn(() => mockedDate)
            global.Date.now = realDate.now
        })

        afterEach(() => {
            global.Date = realDate
        })


        it('should throw an error if workflow state is finished', () => {
            jest.spyOn(WorkflowService, 'getWorkflowState').mockReturnValue({id: 1, type: 'Finished'})
            const story = new Story({id: 1, workflowStateId: 1})
            expect(story.timeInDevelopment()).rejects.toThrow('Story is already finished')
        })

        it('should throw an error if story does not have a started date', () => {
            jest.spyOn(WorkflowService, 'getWorkflowState').mockReturnValue({id: 1, type: 'Started'})
            const story = new Story({id: 1, startedAt: null})
            expect(story.timeInDevelopment()).rejects.toThrow('Story is not started')
        })

        it('should return the time in development', async () => {
            const mockWorkflow = {type: 'SomeWorkflowType'}
            const mockStartedAt = new Date('2021-01-01')

            jest.spyOn(Story.prototype, 'workflow', 'get').mockResolvedValue(mockWorkflow)

            const story = new Story({id: 1, workflowStateId: 1, startedAt: null})
            story.startedAt = mockStartedAt
            const expectedTimeInDevelopment = (mockedDate.getTime() - mockStartedAt.getTime()) / (1000 * 60 * 60)
            await expect(story.timeInDevelopment()).resolves.toEqual(expectedTimeInDevelopment)
        })
    })

    describe('comment method', () => {
        it('successfully posts a comment and returns the story comment object', async () => {
            const commentData = {text: 'Test comment'}
            const expectedResponse = {data: commentData}
            axios.post.mockResolvedValue(expectedResponse)

            const story = new Story({id: 1})
            const result = await story.comment('Test comment')

            expect(result).toEqual(convertApiFields(commentData))
            expect(axios.post).toHaveBeenCalledWith(`${Story.baseUrl}/stories/${story.id}/comments`, {text: 'Test comment'}, {headers: getHeaders()})
        })

        it('throws an error if the axios request fails', async () => {
            axios.post.mockRejectedValue(new Error('Network error'))
            const story = new Story({id: 1}) // Adjust initial data as needed

            await expect(story.comment('Test comment')).rejects.toThrow('Error creating comment: Error: Network error')
        })
    })
})
