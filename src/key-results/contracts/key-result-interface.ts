import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'
import KeyResultValueInterface from '@sx/key-results/contracts/key-result-value-interface'

export default interface KeyResultInterface extends BaseInterface {
    currentObservedValue: KeyResultValueInterface
    currentTargetValue: KeyResultValueInterface
    id: UUID
    initialObservedValue: KeyResultValueInterface
    name: string
    objectiveId: number
    progress: number
    type: 'boolean' | 'numeric' | 'percent'
}
