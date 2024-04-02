import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import EpicInterface from '@sx/epics/contracts/epic-interface'

export default class KeyResult extends ShortcutResource<EpicInterface> {
    public availableOperations: ResourceOperation[] = ['update']

    constructor(init: object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    booleanValue!: boolean
    numberValue!: string
}
