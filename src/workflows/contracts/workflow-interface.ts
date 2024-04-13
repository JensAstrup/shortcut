import BaseInterface from '@sx/base-interface'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'


interface WorkflowInterface extends BaseInterface {
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

export default WorkflowInterface
