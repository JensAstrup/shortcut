import BaseService from '@sx/base-service'
import Epic from '@sx/epics/epic'
import UUID from '@sx/utils/uuid'


export default class EpicsService extends BaseService<Epic> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/epics'
    protected factory = (data: object) => new Epic(data)
    public static epics: Record<number, Epic> = {}

}