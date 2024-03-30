import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import UUID from '@sx/utils/uuid'

export default class Task extends ShortcutResource {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/stories/'
    public availableOperations: ResourceOperation[] = ['update', 'delete']
    public createFields = ['complete', 'createdAt', 'description', 'externalId', 'ownerIds', 'updatedAt']

    constructor(init: object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
        this.baseUrl = `https://api.app.shortcut.com/api/v3/stories/${this.storyId}/tasks`
    }

    complete!: boolean
    completedAt!: Date | null
    createdAt!: Date
    description!: string
    entityType!: string
    externalId!: string | null
    groupMemberId!: UUID[]
    id!: number
    memberMentionIds!: UUID[]
    ownerIds!: UUID[]
    position!: number
    storyId!: number
    updatedAt!: Date
}
