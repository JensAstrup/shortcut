import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'
import Iteration from '@sx/iterations/iteration'


class IterationsService extends BaseSearchableService<Iteration, IterationInterface> {
  public baseUrl = '/iterations'
  protected factory = (data: object): Iteration => new Iteration(data)
  public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}

export { IterationsService as default }

