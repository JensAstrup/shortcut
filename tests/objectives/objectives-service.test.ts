import axios from 'axios'

import Objective from '../../src/objectives/objective'
import ObjectivesService from '../../src/objectives/objectives-service'
import {convertApiFields} from '../../src/utils/convert-fields'


jest.mock('axios')
jest.mock('../../src/utils/convert-fields', () => {
  return {
    convertApiFields: jest.fn().mockImplementation((fields) => fields)
  }
})
const mockedAxios = jest.mocked(axios)


describe('Objectives service', () => {
  it('should return an array of objectives after searching', async () => {
    mockedAxios.get.mockResolvedValue({
      data: {
        data: [{id: 1, name: 'Objective 1', created_at: '2021-01-01T00:00:00Z'},
          {id: 2, name: 'Objective 2', created_at: '2021-01-02T00:00:00Z'}]
      }
    })
    // Create expected Objectives using the Objective constructor to mimic the actual transformation
    const expectedObjectives = [
      new Objective({id: 1, name: 'Objective 1', created_at: '2021-01-01T00:00:00Z'}),
      new Objective({id: 2, name: 'Objective 2', created_at: '2021-01-02T00:00:00Z'})
    ]
    const service = new ObjectivesService({headers: {}})
    const objectives = await service.search('objective')

    // Since we're comparing instances of Objective, either ensure Objective's equality check is appropriate
    // or compare based on a property that should be equal, like IDs or names.
    expectedObjectives.forEach((expectedObjective, index) => {
      expect(objectives.results[index]).toEqual(expect.objectContaining({
        id: expectedObjective.id,
        name: expectedObjective.name
      }))
    })

    expect(convertApiFields).toHaveBeenCalledTimes(2)
  })

  it('should throw an error if the axios request returns a status of 400', async () => {
    mockedAxios.get.mockResolvedValue({status: 400})
    const service = new ObjectivesService({headers: {}})

    await expect(service.search('objective')).rejects.toThrow('HTTP error 400')
  })
})
