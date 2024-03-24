import ShortcutResource from "@base-class";


export default class Iteration extends ShortcutResource {
    public static baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'

    appUrl!: string;
    createdAt!: Date;
    endDate!: Date;
    entityType!: string;
    followerIds!: string[];
    groupIds!: string[];
    groupMentionIds!: string[];
    id!: number;
    labelIds!: number[];
    labels!: Label[];
    memberMentionIds!: string[];
    mentionIds!: string[];
    name!: string;
    startDate!: Date;
    stats!: IterationStats;
    status!: 'unstarted' | 'started' | 'done';
    updatedAt!: Date;

    constructor(init: IterationData) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }


}