import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import UUID from '@sx/utils/uuid'
import ObjectiveInterface from '@sx/objectives/contracts/objective-interface'

export default class Objective extends ShortcutResource<ObjectiveInterface> {
    public baseUrl: string = 'https://api.shortcut.com/api/v3/objectives'
    public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

    constructor(init: object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    appUrl!: string
    archived!: boolean
    categories!: object[]
    completed!: boolean
    completedAt!: Date | null
    completedAtOverride!: Date | null
    createdAt!: Date
    description!: string
    entityType!: string
    id!: number
    keyResultIds!: UUID[]
    name!: string
    position!: number
    started!: boolean
    startedAt!: Date | null
    startedAtOverride!: Date | null
    state!: string
    stats!: object
    updatedAt!: Date
}
