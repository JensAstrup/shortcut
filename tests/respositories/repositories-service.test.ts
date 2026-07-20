import RepositoriesService from '@sx/repositories/repositories-service'

import {stubHttp} from '../helpers/http'


describe('RepositoriesService', () => {
  it('should instantiate a new RepositoriesService', () => {
    const repositoriesService = new RepositoriesService({http: stubHttp()})
    expect(repositoriesService).toBeInstanceOf(RepositoriesService)
    expect(repositoriesService.baseUrl).toEqual('/repositories')
    expect(repositoriesService.availableOperations).toEqual(['get', 'list'])
  })
})
