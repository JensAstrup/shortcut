import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import TeamsService from '@sx/teams/teams-service'


const axiosMock = new AxiosMockAdapter(axios)


describe('TeamsService', () => {

  it('should enable the teams feature', async () => {
    const service = new TeamsService({headers: {'Shortcut-Token': 'Token'}})
    axiosMock.onPost().reply(200, {})
    const result = await service.enable()
    expect(result).toBe(true)
  })

  it('should throw an error when enabling the teams feature fails', async () => {
    const service = new TeamsService({headers: {'Shortcut-Token': 'Token'}})
    axiosMock.onPost().reply(400, {})
    await expect(service.enable()).rejects.toThrow('Request failed with status code 400')
  })

  it('should disable the teams feature', async () => {
    const service = new TeamsService({headers: {'Shortcut-Token': 'Token'}})
    axiosMock.onPost().reply(200, {})
    const result = await service.disable()
    expect(result).toBe(true)
  })

  it('should throw an error when disabling the teams feature fails', async () => {
    const service = new TeamsService({headers: {'Shortcut-Token': 'Token'}})
    axiosMock.onPost().reply(400, {})
    await expect(service.disable()).rejects.toThrow('Request failed with status code 400')
  })

  it('should get a team by name', async () => {
    const service = new TeamsService({headers: {'Shortcut-Token': 'Token'}})
    axiosMock.onGet().reply(200, [{id: '1', name: 'Team 1'}, {id: '2', name: 'Team 2'}])
    const team = await service.getByName('Team 2')
    expect(team?.name).toBe('Team 2')
  })
})
