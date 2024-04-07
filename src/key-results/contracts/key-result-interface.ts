import BaseInterface from '@sx/base-interface'
import KeyResultValueInterface from '@sx/key-results/contracts/key-result-value-interface'
import UUID from '@sx/utils/uuid'


enum KeyResultType {
    BOOLEAN = 'boolean',
    NUMERIC = 'numeric',
    PERCENT = 'percent'
}

interface KeyResultInterface extends BaseInterface {
    currentObservedValue: KeyResultValueInterface
    currentTargetValue: KeyResultValueInterface
    id: UUID
    initialObservedValue: KeyResultValueInterface
    name: string
    objectiveId: number
    progress: number
    type: KeyResultType
}

export default KeyResultInterface
export {KeyResultType}
