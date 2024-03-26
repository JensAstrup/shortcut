import BaseInterface from '@sx/base-interface'

export interface Label {
}

export interface IterationStats {
}

export default interface IterationInterface extends BaseInterface {
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
