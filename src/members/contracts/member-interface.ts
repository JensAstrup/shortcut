import BaseInterface from '@sx/base-interface'
import {MemberProfile} from '@sx/members/contracts/member-profile'


enum MemberState {
  DISABLED = 'disabled',
  FULL = 'full',
  IMPORTED = 'imported',
  PARTIAL = 'partial'
}

interface MemberInterface extends BaseInterface {
  createdAt: string
  disabled: boolean
  entityType: string
  groupIds: string[]
  id: string
  profile: MemberProfile
  role: string
  state: MemberState
  updatedAt: string
}

export default MemberInterface
export {MemberState}
