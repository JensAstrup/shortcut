interface Label {
}

interface IterationStats {
}

interface Iteration {
    app_url: string;
    created_at: Date;
    end_date: Date;
    entity_type: string;
    follower_ids: string[]; // Assuming UUIDs are represented as strings
    group_ids: string[]; // Assuming UUIDs are represented as strings, and noting the current UI limitation
    group_mention_ids: string[]; // Assuming UUIDs are represented as strings
    id: number;
    label_ids: number[];
    labels: Label[];
    member_mention_ids: string[]; // Assuming UUIDs are represented as strings
    mention_ids: string[]; // Assuming UUIDs are represented as strings, but deprecated
    name: string;
    start_date: Date;
    stats: IterationStats;
    status: 'unstarted' | 'started' | 'done';
    updated_at: Date;
}
