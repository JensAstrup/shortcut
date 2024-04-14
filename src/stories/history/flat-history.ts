import BaseInterface from '@sx/base-interface'
import Member from '@sx/members/member'
import UUID from '@sx/utils/uuid'
import WorkflowState from '@sx/workflow-states/workflow-state'


interface FlatHistory extends BaseInterface {
  member: Member
  changedAt: Date
  id: UUID
  newValue: unknown | WorkflowState
  oldValue: unknown| WorkflowState
}

export default FlatHistory
