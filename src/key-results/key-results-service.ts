import BaseService, {ServiceOperation} from '@sx/base-service'
import KeyResult from '@sx/key-results/key-result'


export default class KeyResultsService extends BaseService<KeyResult> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/key_results'
    protected factory = (data: object) => new KeyResult(data)
    public availableOperations: ServiceOperation[] = ['get']
}
