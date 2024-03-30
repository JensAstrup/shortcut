import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import Epic from '@sx/epics/epic'


export default class EpicsService extends BaseSearchableService<Epic> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/epics'
    protected factory = (data: object) => new Epic(data)
    public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}
