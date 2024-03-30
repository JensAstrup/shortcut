import BaseData from '@sx/base-data'
import {PullRequestApiData} from '@sx/pull-requests/contracts/pull-request-api-data'
import {StoryCommentInterface} from '@sx/stories/comment/contracts/story-comment-interface'
import TaskApiData from '@sx/stories/tasks/contracts/task-api-data'


export interface StoryApiData extends BaseData {
    app_url: string;
    archived: boolean;
    blocked: boolean;
    blocker: boolean;
    branches: object[];
    comments: StoryCommentInterface[];
    commits: object[];
    completed: boolean;
    completed_at: Date | null;
    completed_at_override: Date | null;
    created_at: Date;
    custom_fields: object[];
    cycle_time: number;
    deadline: Date | null;
    description: string;
    entity_type: string;
    epic_id: number | null;
    estimate: number | null;
    external_id: string | null;
    external_links: string[];
    files: object[];
    follower_ids: string[]; // UUID
    group_id: string | null; // UUID
    group_mention_ids: string[]; // UUID
    id: number;
    iteration_id: number | null;
    label_ids: number[];
    labels: object[];
    lead_time: number;
    linked_files: object[];
    member_mention_ids: string[]; // UUID
    mention_ids: string[]; // Deprecated: use memberMentionIds.
    moved_at: Date | null;
    name: string;
    owner_ids: string[]; // UUID
    position: number;
    previous_iteration_ids: number[];
    project_id: number | null;
    pull_requests: PullRequestApiData[];
    requested_by_id: string; // UUID
    started: boolean;
    started_at: Date | null;
    started_at_override: Date | null;
    stats: object;
    story_links: object[];
    story_template_id: string | null; // UUID
    story_type: string;
    synced_item: object;
    tasks: TaskApiData[];
    unresolved_blocker_comments: number[];
    updated_at: Date | null;
    workflow_id: number;
    workflow_state_id: number;
}
