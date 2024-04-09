import BaseService, {ServiceOperation} from '@sx/base-service'
import RepositoryInterface from '@sx/repositories/contracts/repository'
import Repository from '@sx/repositories/repository'


class RepositoriesService extends BaseService<Repository, RepositoryInterface>{
  public baseUrl = 'https://api.app.shortcut.com/api/v3/repositories'
  protected factory = (data: RepositoryInterface) => new Repository(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']
}

export default RepositoriesService
