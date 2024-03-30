import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import LabelInterface from '@sx/labels/contracts/label-interface'


export default class Label extends ShortcutResource {
    public static baseUrl: string = 'https://api.shortcut.com/api/v3/labels'
    public createFields = ['color', 'description', 'externalId', 'name']
    public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

    constructor(init: LabelInterface | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    appUrl!: string
    archived!: boolean
    color!: string | null
    createdAt!: string | null
    description!: string | null
    entityType!: string
    externalId!: string | null
    id!: number
    name!: string
    stats!: object[]
    updatedAt!: string | null
}
