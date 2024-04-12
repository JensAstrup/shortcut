import axios from 'axios'

import TeamsService from '@sx/teams/teams-service'


jest.mock('axios', () => ({
  post: jest.fn(),
  get: jest.fn()
}))

describe('TeamsService', () => {

  it('should enable the teams feature', async () => {
    const service = new TeamsService({headers: {}})
    axios.post = jest.fn().mockResolvedValue({status: 200})
    const result = await service.enable()
    expect(result).toBe(true)
  })

  it('should throw an error when enabling the teams feature fails', async () => {
    const service = new TeamsService({headers: {}})
    axios.post = jest.fn().mockRejectedValue({status: 400})
    await expect(service.enable()).rejects.toThrow('HTTP error 400')
  })

  it('should disable the teams feature', async () => {
    const service = new TeamsService({headers: {}})
    axios.post = jest.fn().mockResolvedValue({status: 200})
    const result = await service.disable()
    expect(result).toBe(true)
  })

  it('should throw an error when disabling the teams feature fails', async () => {
    const service = new TeamsService({headers: {}})
    axios.post = jest.fn().mockRejectedValue({status: 400})
    await expect(service.disable()).rejects.toThrow('HTTP error 400')
  })

  it('should get a team by name', async () => {
    const service = new TeamsService({headers: {}})
    axios.get = jest.fn().mockResolvedValue({data: [{id: '1', name: 'Team 1'}, {id: '2', name: 'Team 2'}]})
    const team = await service.getByName('Team 2')
    expect(team?.name).toBe('Team 2')
  })
})
