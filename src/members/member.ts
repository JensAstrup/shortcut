import ShortcutResource from '@sx/base-resource'

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

    public static baseUrl = 'https://api.app.shortcut.com/api/v3/members'

}
