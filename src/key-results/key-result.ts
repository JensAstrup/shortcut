import {ResourceBaseFor, Updatable} from '@sx/base-resource'
import KeyResultInterface, {KeyResultType} from '@sx/key-results/contracts/key-result-interface'
import KeyResultValueInterface from '@sx/key-results/contracts/key-result-value-interface'
import UUID from '@sx/utils/uuid'


class KeyResult extends Updatable(ResourceBaseFor<KeyResultInterface>()) implements KeyResultInterface {
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
  type: KeyResultType
  id: UUID
}

export { KeyResult as default }

