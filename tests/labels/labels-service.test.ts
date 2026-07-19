import LabelsService from '@sx/labels/labels-service'

import Label from '../../src/labels/label'
import {stubHttp} from '../helpers/http'


describe('Labels Service', () => {
  it('should get a label by name', async () => {
    const http = stubHttp();
    (http.get as jest.Mock).mockResolvedValue({
      data: [
        {name: 'Bug', color: 'red', id: 1},
        {name: 'Feature', color: 'green', id: 2},
        {name: 'Chore', color: 'blue', id: 3}
      ]
    })
    const labelsService = new LabelsService({http})
    const label = await labelsService.getByName('Bug')
    expect(label).toBeInstanceOf(Label)
    expect(label?.name).toBe('Bug')
    expect(label?.color).toBe('red')
    expect(label?.id).toBe(1)
  })

  it('should return null if no label is found', async () => {
    const http = stubHttp();
    (http.get as jest.Mock).mockResolvedValue({
      data: [
        {name: 'Bug', color: 'red', id: 1},
        {name: 'Feature', color: 'green', id: 2},
        {name: 'Chore', color: 'blue', id: 3}
      ]
    })
    const labelsService = new LabelsService({http})
    const label = await labelsService.getByName('Task')
    expect(label).toBeNull()
  })
})
