import Iteration from '@sx/iterations/iteration'
import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'


export default class IterationsService extends BaseSearchableService<Iteration, IterationInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    protected factory = (data: object) => new Iteration(data)
    public availableOperations: ServiceOperation[] = ['get', 'search', 'list']
}
