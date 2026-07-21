import BaseService, {ServiceOperation} from '@sx/base-service'
import RepositoryInterface from '@sx/repositories/contracts/repository'
import Repository from '@sx/repositories/repository'


class RepositoriesService extends BaseService<Repository, RepositoryInterface>{
  public baseUrl = '/repositories'
  protected factory = (data: RepositoryInterface): Repository => new Repository(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']
}

export default RepositoriesService
