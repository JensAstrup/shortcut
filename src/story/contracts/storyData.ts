import {StoryComment} from '@sx/story/comment/story-comment'

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

export interface PullRequest {
}

export interface StoryStats {
}

export interface TypedStoryLink {
}

export interface SyncedItem {
}

export interface Task {
}

export interface StoryData {
    appUrl: string;
    archived: boolean;
    blocked: boolean;
    blocker: boolean;
    branches: Branch[];
    comments: StoryComment[];
    commits: Commit[];
    completed: boolean;
    completedAt: Date | null;
    completedAtOverride: Date | null;
    createdAt: Date;
    customFields: StoryCustomField[];
    cycleTime: number;
    deadline: Date | null;
    description: string;
    entityType: string;
    epicId: number | null;
    estimate: number | null;
    externalId: string | null;
    externalLinks: string[];
    files: UploadedFile[];
    followerIds: string[]; // UUID
    groupId: string | null; // UUID
    groupMentionIds: string[]; // UUID
    id: number;
    iterationId: number | null;
    labelIds: number[];
    labels: LabelSlim[];
    leadTime: number;
    linkedFiles: LinkedFile[];
    memberMentionIds: string[]; // UUID
    mentionIds: string[]; // Deprecated: use memberMentionIds.
    movedAt: Date | null;
    name: string;
    ownerIds: string[]; // UUID
    position: number;
    previousIterationIds: number[];
    projectId: number | null;
    pullRequests: PullRequest[];
    requestedById: string; // UUID
    started: boolean;
    startedAt: Date | null;
    startedAtOverride: Date | null;
    stats: StoryStats;
    storyLinks: TypedStoryLink[];
    storyTemplateId: string | null; // UUID
    storyType: string;
    syncedItem: SyncedItem;
    tasks: Task[];
    unresolvedBlockerComments: number[];
    updatedAt: Date | null;
    workflowId: number;
    workflowStateId: number;
}
