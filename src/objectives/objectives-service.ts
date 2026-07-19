import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import ObjectiveInterface from '@sx/objectives/contracts/objective-interface'
import Objective from '@sx/objectives/objective'


class ObjectivesService extends BaseSearchableService<Objective, ObjectiveInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/objectives'
  protected factory = (data: object): Objective => new Objective(data)
  public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}

export { ObjectivesService as default }

