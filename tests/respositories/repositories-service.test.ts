import RepositoriesService from '@sx/repositories/repositories-service'


describe('RepositoriesService', () => {
  it('should instantiate a new RepositoriesService', () => {
    const repositoriesService = new RepositoriesService({headers: {}})
    expect(repositoriesService).toBeInstanceOf(RepositoriesService)
    expect(repositoriesService.baseUrl).toEqual('https://api.app.shortcut.com/api/v3/repositories')
    expect(repositoriesService.availableOperations).toEqual(['get', 'list'])
  })
})
