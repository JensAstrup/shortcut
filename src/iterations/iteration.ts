import ShortcutResource from '@sx/base-resource'
import {IterationStats, Label} from '@sx/iterations/contracts/iteration'
import {IterationData} from '@sx/iterations/contracts/iterationData'


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

    constructor(init: IterationData | object) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }
}
