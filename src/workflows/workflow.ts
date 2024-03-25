export interface WorkflowState {
    [index: string]: unknown;

    color: string; // Assuming color is a hex string (e.g., "#FFFFFF")
    createdAt: Date;
    description: string;
    entityType: string;
    id: number;
    name: string;
    numStories: number;
    numStoryTemplates: number;
    position: number;
    type: string;
    updatedAt: Date;
    verb: string | null;
}

export interface Workflow {
    autoAssignOwner: boolean;
    createdAt: Date;
    defaultStateId: number;
    description: string;
    entityType: string;
    id: number;
    name: string;
    projectIds: number[];
    states: WorkflowState[];
    teamId: number;
    updatedAt: Date;
}
