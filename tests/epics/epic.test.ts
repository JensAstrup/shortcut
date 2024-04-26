import axios from 'axios'

import Epic from '../../src/epics/epic'
import Objective from '../../src/objectives/objective'
import ObjectivesService from '../../src/objectives/objectives-service'
import Team from '../../src/teams/team'
import TeamsService from '../../src/teams/teams-service'
import {convertApiFields} from '../../src/utils/convert-fields'
import {getHeaders} from '../../src/utils/headers'


jest.mock('axios', () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn()
}))

const mockedAxios = axios as jest.Mocked<typeof axios>

describe('Epic', () => {
  process.env.SHORTCUT_API_KEY = 'token'
  beforeEach(() => {
    mockedAxios.post.mockClear()
  })

  describe('objectives getter', () => {
    it('returns an array of objectives', () => {
      const objectives = [{id: 1}, {id: 2}]
      jest.spyOn(ObjectivesService.prototype, 'getMany').mockResolvedValue(objectives as unknown as Objective[])
      const epic = new Epic({id: 1, objectiveIds: [1, 2]})
      expect(epic.objectives).resolves.toEqual([{id: 1}, {id: 2}])
      expect(ObjectivesService.prototype.getMany).toHaveBeenCalledWith([1, 2])
    })
  })

  describe('teams getter', () => {
    it('returns the team object', () => {
      const teams = [{id: 1}]
      jest.spyOn(TeamsService.prototype, 'getMany').mockResolvedValue(teams as unknown as Team[])
      const epic = new Epic({groupIds: [1]})
      expect(epic.teams).resolves.toEqual([{id: 1}])
      expect(TeamsService.prototype.getMany).toHaveBeenCalledWith([1])
    })
  })

  describe('comment method', () => {
    it('successfully posts a comment and returns the epic comment object', async () => {
      const commentData = {text: 'Test comment'}
      const expectedResponse = {data: commentData}
      mockedAxios.post.mockResolvedValue(expectedResponse)

      const epic = new Epic({id: 1})
      const result = await epic.comment('Test comment')

      expect(result).toEqual(convertApiFields(commentData))
      expect(mockedAxios.post).toHaveBeenCalledWith(`${Epic.baseUrl}/${epic.id}/comments`, {text: 'Test comment'}, {headers: getHeaders()})
    })

    it('throws an error if the mockedAxios request fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'))
      const epic = new Epic({id: 1})

      await expect(epic.comment('Test comment')).rejects.toThrow('Failed to add comment')
    })
  })

  describe('addComment method', () => {
    it('successfully posts a comment and returns the epic comment object', async () => {
      const commentData = {text: 'Test comment'}
      const expectedResponse = {data: commentData}
      mockedAxios.post.mockResolvedValue(expectedResponse)

      const epic = new Epic({id: 1})
      const comment = {
        text: 'Test comment',
        authorId: '123',
        createdAt: null,
        externalId: null,
        updatedAt: null
      }
      const result = await epic.addComment(comment)

      expect(result).toEqual(convertApiFields(commentData))
      expect(mockedAxios.post).toHaveBeenCalledWith(`${Epic.baseUrl}/${epic.id}/comments`, {
        text: 'Test comment',
        author_id: '123',
        created_at: null,
        external_id: null,
        updated_at: null
      }, {headers: getHeaders()})

    })

    it('throws an error if the mockedAxios request fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Network error'))
      const epic = new Epic({id: 1})
      const comment = {
        text: 'Test comment',
        authorId: '123',
        createdAt: null,
        externalId: null,
        updatedAt: null
      }

      await expect(epic.addComment(comment)).rejects.toThrow('Failed to add comment')
    })
  })
})
