export interface Label {
}

export interface IterationStats {
}

interface Iteration {
    appUrl: string;
    createdAt: Date;
    endDate: Date;
    entityType: string;
    followerIds: string[];
    groupIds: string[];
    groupMentionIds: string[];
    id: number;
    labelIds: number[];
    labels: Label[];
    memberMentionIds: string[];
    mentionIds: string[];
    name: string;
    startDate: Date;
    stats: IterationStats;
    status: 'unstarted' | 'started' | 'done';
    updatedAt: Date;
}
