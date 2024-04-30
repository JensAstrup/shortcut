import BaseInterface from '@sx/base-interface'
import Member from '@sx/members/member'
import {ShortcutFieldType} from '@sx/utils/field-type'
import UUID from '@sx/utils/uuid'
import WorkflowState from '@sx/workflow-states/workflow-state'


interface FlatHistory extends BaseInterface {
  member: Member
  changedAt: Date
  id: UUID
  newValue: ShortcutFieldType | WorkflowState
  oldValue: ShortcutFieldType | WorkflowState
}

export default FlatHistory
