import BaseData from '@sx/base-data'
import {PullRequest} from '@sx/pull-requests/contracts/pull-request-api-data'
import {StoryComment} from '@sx/stories/comment/story-comment'


export interface Branch {
}

export interface Commit {
}

export interface StoryCustomField {
}

export interface UploadedFile {
}

export interface LabelSlim {
}

export interface LinkedFile {
}

export interface StoryStats {
}

export interface TypedStoryLink {
}

export interface SyncedItem {
}

export interface Task {
}

export interface StoryApiData extends BaseData {
    app_url: string;
    archived: boolean;
    blocked: boolean;
    blocker: boolean;
    branches: Branch[];
    comments: StoryComment[];
    commits: Commit[];
    completed: boolean;
    completed_at: Date | null;
    completed_at_override: Date | null;
    created_at: Date;
    custom_fields: StoryCustomField[];
    cycle_time: number;
    deadline: Date | null;
    description: string;
    entity_type: string;
    epic_id: number | null;
    estimate: number | null;
    external_id: string | null;
    external_links: string[];
    files: UploadedFile[];
    follower_ids: string[]; // UUID
    group_id: string | null; // UUID
    group_mention_ids: string[]; // UUID
    id: number;
    iteration_id: number | null;
    label_ids: number[];
    labels: LabelSlim[];
    lead_time: number;
    linked_files: LinkedFile[];
    member_mention_ids: string[]; // UUID
    mention_ids: string[]; // Deprecated: use memberMentionIds.
    moved_at: Date | null;
    name: string;
    owner_ids: string[]; // UUID
    position: number;
    previous_iteration_ids: number[];
    project_id: number | null;
    pull_requests: PullRequest[];
    requested_by_id: string; // UUID
    started: boolean;
    started_at: Date | null;
    started_at_override: Date | null;
    stats: StoryStats;
    story_links: TypedStoryLink[];
    story_template_id: string | null; // UUID
    story_type: string;
    synced_item: SyncedItem;
    tasks: Task[];
    unresolved_blocker_comments: number[];
    updated_at: Date | null;
    workflow_id: number;
    workflow_state_id: number;
}
