import BaseInterface from '@sx/base-interface'

export interface WorkflowStateInterface extends BaseInterface {
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
