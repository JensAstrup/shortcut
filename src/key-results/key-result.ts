import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import KeyResultInterface from '@sx/key-results/contracts/key-result-interface'
import KeyResultValueInterface from '@sx/key-results/contracts/key-result-value-interface'
import UUID from '@sx/utils/uuid'


export default class KeyResult extends ShortcutResource<KeyResultInterface> implements KeyResultInterface {
  public availableOperations: ResourceOperation[] = ['update']

  constructor(init: object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  booleanValue: boolean
  numberValue: string
  currentObservedValue: KeyResultValueInterface
  currentTargetValue: KeyResultValueInterface
  initialObservedValue: KeyResultValueInterface
  name: string
  objectiveId: number
  progress: number
  type: 'boolean' | 'numeric' | 'percent'
  id: UUID
}
