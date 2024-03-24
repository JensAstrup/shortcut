import ShortcutResource from "@base-class"
import axios from "axios";
import {getHeaders} from "@utils/headers";
import {StoryComment, StoryCommentData} from "@story/comment/story-comment";
import {convertKeysToCamelCase} from "@utils/convert-fields";
import WorkflowService from "@workflows/workflows-service";
import camelToSnake from "@utils/camel-to-snake";
import {
    Branch,
    Commit, LabelSlim, LinkedFile, PullRequest,
    StoryCustomField,
    StoryData, StoryStats, SyncedItem, Task, TypedStoryLink,
    UploadedFile
} from "@story/contracts/storyData";


export class Story extends ShortcutResource implements StoryData {
    constructor(init: StoryData) {
        super()
        Object.assign(this, init)
        this.changedFields = []
    }

    get workflow() {
        return WorkflowService.getWorkflowState(this.workflowStateId)
    }

    public async comment(comment: string): Promise<StoryComment | void> {
        const url = `${Story.baseUrl}/stories/${this.id}/comments`
        const response = await axios.post(url, {text: comment}, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error creating comment: ${error}`)
        })
        const data: StoryCommentData = response.data
        return convertKeysToCamelCase(data) as StoryComment
    }

    public async save(): Promise<Story> {
        const url = `${Story.baseUrl}/stories/${this.id}`;
        const body = this.changedFields.reduce((acc: {[key: string]: unknown}, field) => {
            acc[camelToSnake(field)] = (this as any)[field];
            return acc;
        }, {});

        const response = await axios.put(url, body, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error saving story: ${error}`);
        });

        const data: StoryData = response.data;
        this.changedFields = [];
        return new Story(data);
    }

    public async delete(): Promise<void> {
        const url = `${Story.baseUrl}/stories/${this.id}`;
        await axios.delete(url, {headers: getHeaders()}).catch((error) => {
            throw new Error(`Error deleting story: ${error}`);
        });
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
