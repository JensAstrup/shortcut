import BaseData from '@sx/base-data'


export default interface EpicWorkflowStateApiData extends BaseData {
    color: string
    created_at: string
    description: string
    entity_type: string
    id: number
    name: string
    position: number
    type: string
    updated_at: string
}
