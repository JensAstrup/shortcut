import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import KeyResultInterface from '@sx/key-results/contracts/key-result-interface'


export default class KeyResult extends ShortcutResource<KeyResultInterface> {
    public availableOperations: ResourceOperation[] = ['update']

    constructor(init: object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    booleanValue!: boolean
    numberValue!: string
}
