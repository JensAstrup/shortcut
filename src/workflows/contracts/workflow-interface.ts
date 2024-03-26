import {WorkflowStateInterface} from '@sx/workflows/contracts/workflow-state-interface'
import BaseInterface from '@sx/base-interface'

export interface WorkflowInterface extends BaseInterface {
    autoAssignOwner: boolean;
    createdAt: Date;
    defaultStateId: number;
    description: string;
    entityType: string;
    id: number;
    name: string;
    projectIds: number[];
    states: WorkflowStateInterface[];
    teamId: number;
    updatedAt: Date;
}
