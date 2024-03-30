import Iteration from '@sx/iterations/iteration'
import {BaseSearchableService} from '@sx/base-service'


export default class IterationsService extends BaseSearchableService<Iteration> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    protected factory = (data: object) => new Iteration(data)
}
