import {IterationStats, Label} from '@iterations/contracts/iteration'

export interface IterationData {
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
