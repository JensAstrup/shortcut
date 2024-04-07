import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'


export default interface KeyResultValueApiData extends BaseData {
    current_observed_value: KeyResultValueApiData
    current_target_value: KeyResultValueApiData
    id: UUID
    initial_observed_value: KeyResultValueApiData
    name: string
    objective_id: number
    progress: number
    type: 'boolean' | 'numeric' | 'percent'
}
