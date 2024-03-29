import BaseInterface from '@sx/base-interface'


export interface StoryComment extends BaseInterface {
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
