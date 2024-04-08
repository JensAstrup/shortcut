import BaseData from '@sx/base-data'
import EpicWorkflowStateApiData from '@sx/epics/workflows/contracts/epic-workflow-state-api-data'


export default interface EpicWorkflowApiData extends BaseData {
    created_at: string
    default_epic_state_id: number
    entity_type: string
    epic_states: EpicWorkflowStateApiData[]
    id: number
    updated_at: string
}
