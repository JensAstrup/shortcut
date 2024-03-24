interface Label {
}

interface IterationStats {
}

interface IterationData {
    app_url: string;
    created_at: Date;
    end_date: Date;
    entity_type: string;
    follower_ids: string[];
    group_ids: string[];
    group_mention_ids: string[];
    id: number;
    label_ids: number[];
    labels: Label[];
    member_mention_ids: string[];
    mention_ids: string[];
    name: string;
    start_date: Date;
    stats: IterationStats;
    status: 'unstarted' | 'started' | 'done';
    updated_at: Date;
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
