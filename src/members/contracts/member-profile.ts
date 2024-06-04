import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'
import Workspace from '@sx/workspace/contracts/workspace'


interface MemberProfile extends BaseInterface {
  deactivated: boolean
  displayIcon: string
  emailAddress: string
  gravatarHash: string
  id: UUID
  isOwner: boolean
  mentionName: string
  name: string
  twoFactorAuthEnabled: boolean
  workspace: Workspace
}

export { MemberProfile }
export default MemberProfile
