import {BaseSearchableService} from '@sx/base-service'
import Objective from '@sx/objectives/objective'

export default class ObjectivesService extends BaseSearchableService<Objective> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/objectives'
    protected factory = (data: object) => new Objective(data)

}
