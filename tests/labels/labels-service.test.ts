import axios from 'axios'

import LabelsService from '@sx/labels/labels-service'

import Label from '../../src/labels/label'


jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>


describe('Labels Service', () => {
  it('should get a label by name', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {name: 'Bug', color: 'red', id: 1},
        {name: 'Feature', color: 'green', id: 2},
        {name: 'Chore', color: 'blue', id: 3}
      ]
    })
    const labelsService = new LabelsService({headers: {'Authorization': 'Bearer'}})
    const label = await labelsService.getByName('Bug')
    expect(label).toBeInstanceOf(Label)
    expect(label?.name).toBe('Bug')
    expect(label?.color).toBe('red')
    expect(label?.id).toBe(1)
  })

  it('should return null if no label is found', async () => {
    mockedAxios.get.mockResolvedValue({
      data: [
        {name: 'Bug', color: 'red', id: 1},
        {name: 'Feature', color: 'green', id: 2},
        {name: 'Chore', color: 'blue', id: 3}
      ]
    })
    const labelsService = new LabelsService({headers: {'Authorization': 'Bearer'}})
    const label = await labelsService.getByName('Task')
    expect(label).toBeNull()
  })
})
