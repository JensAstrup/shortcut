import axios from 'axios'

import Label from '@sx/labels/label'


jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>


describe('Label', () => {
  it('should instantiate a new Label', () => {
    const labelData = {id: 21}
    const label = new Label(labelData)
    expect(label.id).toEqual(21)
  })

  it('should get related stories', async () => {
    const story1 = {id: 1, name: 'Story 1'}
    const story2 = {id: 2, name: 'Story 2'}
    mockedAxios.get.mockResolvedValue({data: [story1, story2]})
    const labelData = {id: 21}
    const label = new Label(labelData)
    const stories = await label.stories()
    expect(stories).toBeInstanceOf(Array)
    expect(stories.length).toEqual(2)
    expect(stories[0].name).toEqual('Story 1')
    expect(stories[1].name).toEqual('Story 2')
  })

  it('should get related epics', async () => {
    const epic1 = {id: 1, name: 'Epic 1'}
    const epic2 = {id: 2, name: 'Epic 2'}
    mockedAxios.get.mockResolvedValue({data: [epic1, epic2]})
    const labelData = {id: 21}
    const label = new Label(labelData)
    const epics = await label.epics()
    expect(epics).toBeInstanceOf(Array)
    expect(epics.length).toEqual(2)
    expect(epics[0].name).toEqual('Epic 1')
    expect(epics[1].name).toEqual('Epic 2')
  })
})
