import {Gettable, ServiceBaseFor} from '@sx/base-service'
import KeyResultInterface from '@sx/key-results/contracts/key-result-interface'
import KeyResult from '@sx/key-results/key-result'


class KeyResultsService extends Gettable(ServiceBaseFor<KeyResult, KeyResultInterface>()) {
  public baseUrl = '/key_results'
  protected factory = (data: object): KeyResult => new KeyResult(data)
}

export { KeyResultsService as default }

