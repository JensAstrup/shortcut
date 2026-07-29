import {Gettable, Listable, Searchable, ServiceBaseFor} from '@sx/base-service'
import ObjectiveInterface from '@sx/objectives/contracts/objective-interface'
import Objective from '@sx/objectives/objective'


class ObjectivesService extends Searchable(Listable(Gettable(ServiceBaseFor<Objective, ObjectiveInterface>()))) {
  public baseUrl = '/objectives'
  protected factory = (data: object): Objective => new Objective(data)
}

export { ObjectivesService as default }

