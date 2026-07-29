import {Gettable, Listable, Searchable, ServiceBaseFor} from '@sx/base-service'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'
import Iteration from '@sx/iterations/iteration'


class IterationsService extends Searchable(Listable(Gettable(ServiceBaseFor<Iteration, IterationInterface>()))) {
  public baseUrl = '/iterations'
  protected factory = (data: object): Iteration => new Iteration(data)
}

export { IterationsService as default }

