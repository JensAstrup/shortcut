import ShortcutResource from '@base-class'
import {IterationStats, Label} from '@iterations/contracts/iteration'
import {IterationData} from '@iterations/contracts/iterationData'


export default class Iteration extends ShortcutResource {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    public createFields: string[] = ['name', 'startDate', 'endDate', 'labels']

    appUrl!: string
    createdAt!: Date
    endDate!: string
    entityType!: string
    followerIds!: string[]
    groupIds!: string[]
    groupMentionIds!: string[]
    id!: number
    labelIds!: number[]
    labels!: Label[]
    memberMentionIds!: string[]
    mentionIds!: string[]
    name!: string
    startDate!: Date
    stats!: IterationStats
    status!: 'unstarted' | 'started' | 'done'
    updatedAt!: Date

    constructor(init: IterationData) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }
}
