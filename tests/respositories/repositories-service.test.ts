import RepositoriesService from '@sx/repositories/repositories-service'

import {stubHttp} from '../helpers/http'


describe('RepositoriesService', () => {
  it('should instantiate a new RepositoriesService', () => {
    const repositoriesService = new RepositoriesService({http: stubHttp()})
    expect(repositoriesService).toBeInstanceOf(RepositoriesService)
    expect(repositoriesService.baseUrl).toEqual('/repositories')
    expect(typeof repositoriesService.get).toBe('function')
    expect(typeof repositoriesService.list).toBe('function')
    // @ts-expect-error repositories are not searchable
    void repositoriesService.search
  })
})
