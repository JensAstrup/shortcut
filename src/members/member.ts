import ShortcutResource from '@sx/base-resource'
import StoryInterface from '@sx/stories/contracts/story-interface'


/**
 * @inheritDoc
 */
export default class Member extends ShortcutResource {
    createdAt!: string
    disabled!: boolean
    entityType!: string
    groupIds!: string[]
    id!: string
    profile!: object
    role!: string
    state!: 'disabled' | 'full' | 'imported' | 'partial'
    updatedAt!: string

    public baseUrl = 'https://api.app.shortcut.com/api/v3/members'

    constructor(init: StoryInterface | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }
}
