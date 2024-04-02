import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import Objective from '@sx/objectives/objective'
import ObjectiveInterface from '@sx/objectives/contracts/objective-interface'

export default class ObjectivesService extends BaseSearchableService<Objective, ObjectiveInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/objectives'
    protected factory = (data: object) => new Objective(data)
    public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}
