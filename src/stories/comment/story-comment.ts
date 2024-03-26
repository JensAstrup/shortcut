export interface StoryComment {
    authorId: string; // UUID
    createdAt: Date;
    deleted: boolean
    id: number;
    memberMentionIds: string[]; // UUID
    parentId: number | null;
    text: string | null;
    updatedAt: Date;
    updatedAtOverride: Date;
    version: number;
}

// Create StoryComment type
export type StoryCommentData = {
    authorId: string; // UUID
    createdAt: Date;
    deleted: boolean
    id: number;
    memberMentionIds: string[]; // UUID
    parentId: number | null;
    text: string | null;
    updatedAt: Date;
    updatedAtOverride: Date;
    version: number;
}
