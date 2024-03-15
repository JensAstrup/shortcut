import ShortcutResource from "@/src/base-class"

interface Branch {
}

interface StoryComment {
}

interface Commit {
}

interface StoryCustomField {
}

interface UploadedFile {
}

interface LabelSlim {
}

interface LinkedFile {
}

interface PullRequest {
}

interface StoryStats {
}

interface TypedStoryLink {
}

interface SyncedItem {
}

interface Task {
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


export class Story extends ShortcutResource implements StoryData {
    constructor(init: StoryData) {
        super()
        Object.assign(this, init)
    }

    appUrl!: string;
    archived!: boolean;
    blocked!: boolean;
    blocker!: boolean;
    branches!: Branch[];
    comments!: StoryComment[];
    commits!: Commit[];
    completed!: boolean;
    completedAt!: Date | null;
    completedAtOverride!: Date | null;
    createdAt!: Date;
    customFields!: StoryCustomField[];
    cycleTime!: number;
    deadline!: Date | null;
    description!: string;
    entityType!: string;
    epicId!: number | null;
    estimate!: number | null;
    externalId!: string | null;
    externalLinks!: string[];
    files!: UploadedFile[];
    followerIds!: string[];
    groupId!: string | null;
    groupMentionIds!: string[];
    id!: number;
    iterationId!: number | null;
    labelIds!: number[];
    labels!: LabelSlim[];
    leadTime!: number;
    linkedFiles!: LinkedFile[];
    memberMentionIds!: string[];
    mentionIds!: string[];
    movedAt!: Date | null;
    name!: string;
    ownerIds!: string[];
    position!: number;
    previousIterationIds!: number[];
    projectId!: number | null;
    pullRequests!: PullRequest[];
    requestedById!: string;
    started!: boolean;
    startedAt!: Date | null;
    startedAtOverride!: Date | null;
    stats!: StoryStats;
    storyLinks!: TypedStoryLink[];
    storyTemplateId!: string | null;
    storyType!: string;
    syncedItem!: SyncedItem;
    tasks!: Task[];
    unresolvedBlockerComments!: number[];
    updatedAt!: Date | null;
    workflowId!: number;
    workflowStateId!: number;
}
