import BaseData from '@sx/base-data'


export interface WorkflowStateApiData extends BaseData {
    color: string;
    createdAt: Date;
    description: string;
    entityType: string;
    id: number;
    name: string;
    num_stories: number;
    num_story_templates: number;
    position: number;
    type: string;
    updated_at: Date;
    verb: string | null;
}
