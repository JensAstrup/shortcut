import axios, {AxiosError} from 'axios'

import Epic from '../../src/epics/epic'
import EpicsService from '../../src/epics/epics-service'
import {convertApiFields} from '../../src/utils/convert-fields'
import {handleResponseFailure} from '../../src/utils/handle-response-failure'

import mocked = jest.mocked


jest.mock('axios')
jest.mock('../../src/utils/convert-fields', () => {
  return {
    convertApiFields: jest.fn().mockImplementation((fields) => fields)
  }
})

jest.mock('../../src/utils/handle-response-failure')
const mockHandleResponseFailure = jest.mocked(handleResponseFailure, {shallow: false}) as jest.Mock


const mockedAxios = mocked(axios)

describe('Epics service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should get workflow', () => {
    mockedAxios.get.mockResolvedValue({data: {id: 1, name: 'Workflow 1'}})
    const service = new EpicsService({headers: {}})
    expect(service.getWorkflow()).resolves.toEqual({id: 1, name: 'Workflow 1'})
    expect(mockedAxios.get).toHaveBeenCalledWith('https://api.app.shortcut.com/api/v3/epic-workflow', {headers: {}})
  })

  it('should throw an error if getWorkflow fails', async () => {
    mockedAxios.get.mockRejectedValue(new Error('Failed to fetch epic workflow'))
    const service = new EpicsService({headers: {}})
    await expect(service.getWorkflow()).rejects.toThrow('Failed to fetch epic workflow')
    expect(mockHandleResponseFailure).toHaveBeenCalledTimes(1)
  })

  it('should return an array of epics after searching', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [{id: 1, name: 'Epic 1', created_at: '2021-01-01T00:00:00Z'},
          {id: 2, name: 'Epic 2', created_at: '2021-01-02T00:00:00Z'}]
      }
    })
    // Create expected Epics using the Epic constructor to mimic the actual transformation
    const expectedEpics = [
      new Epic({id: 1, name: 'Epic 1', created_at: '2021-01-01T00:00:00Z'}),
      new Epic({id: 2, name: 'Epic 2', created_at: '2021-01-02T00:00:00Z'})
    ]
    const service = new EpicsService({headers: {}})
    const epics = await service.search('epic')

    // Since we're comparing instances of Epic, either ensure Epic's equality check is appropriate
    // or compare based on a property that should be equal, like IDs or names.
    expectedEpics.forEach((expectedEpic, index) => {
      expect(epics.results[index]).toEqual(expect.objectContaining({
        id: expectedEpic.id,
        name: expectedEpic.name
      }))
    })

    expect(convertApiFields).toHaveBeenCalledTimes(2)
  })

  it('should handle an empty response', () => {
    mockedAxios.get.mockResolvedValue({
      status: 200,
      data: []
    })
    const service = new EpicsService({headers: {}})
    expect(service.search('epic')).resolves.toEqual({results: [], next: undefined})
  })

  it('should throw an error if response is 400 or greater', () => {
    mockedAxios.get.mockResolvedValue({
      status: 400,
      data: {error: 'An error occurred'}
    })
    const service = new EpicsService({headers: {}})
    expect(service.search('epic')).rejects.toThrow('HTTP error 400')
  })
})
