import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


enum MemberState {
  DISABLED = 'disabled',
  FULL = 'full',
  IMPORTED = 'imported',
  PARTIAL = 'partial'
}

interface MemberProfile {
  deactivated: boolean,
  displayIcon: string,
  emailAddress: string,
  gravatarHash: string,
  id: UUID,
  isOwner: boolean,
  mentionName: string,
  name: string,
  twoFactorAuthEnabled: boolean
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
export {MemberProfile, MemberState}
