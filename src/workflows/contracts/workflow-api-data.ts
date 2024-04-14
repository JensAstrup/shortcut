import BaseData from '@sx/base-data'
import WorkflowStateInterface from '@sx/workflow-states/contracts/workflow-state-interface'


interface WorkflowApiData extends BaseData {
    auto_assign_owner: boolean;
    created_at: Date;
    default_state_id: number;
    description: string;
    entity_type: string;
    id: number;
    name: string;
    project_ids: number[];
    states: WorkflowStateInterface[];
    teamId: number;
    updated_at: Date;
}

export default WorkflowApiData
