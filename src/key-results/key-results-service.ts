import BaseService, {ServiceOperation} from '@sx/base-service'
import KeyResultInterface from '@sx/key-results/contracts/key-result-interface'
import KeyResult from '@sx/key-results/key-result'


class KeyResultsService extends BaseService<KeyResult, KeyResultInterface> {
  public baseUrl = '/key_results'
  protected factory = (data: object): KeyResult => new KeyResult(data)
  public availableOperations: ServiceOperation[] = ['get']
}

export { KeyResultsService as default }

