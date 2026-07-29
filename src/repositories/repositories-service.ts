import {Gettable, Listable, ServiceBaseFor} from '@sx/base-service'
import RepositoryInterface from '@sx/repositories/contracts/repository'
import Repository from '@sx/repositories/repository'


class RepositoriesService extends Listable(Gettable(ServiceBaseFor<Repository, RepositoryInterface>())) {
  public baseUrl = '/repositories'
  protected factory = (data: RepositoryInterface): Repository => new Repository(data)
}

export default RepositoriesService
