import ShortcutResource, {ResourceOperation} from '@sx/base-resource'

export default class KeyResult extends ShortcutResource {
    public availableOperations: ResourceOperation[] = ['update']

    constructor(init: object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    booleanValue!: boolean
    numberValue!: string
}
