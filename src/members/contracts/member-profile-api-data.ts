import BaseData from '@sx/base-data'
import UUID from '@sx/utils/uuid'
import WorkspaceApiData from '@sx/workspace/contracts/workspace-api-data'


interface MemberProfileApiData extends BaseData {
  deactivated: boolean,
  display_icon: string,
  email_address: string,
  gravatar_hash: string,
  id: UUID,
  is_owner: boolean,
  mention_name: string,
  name: string,
  two_factor_auth_enabled: boolean
  workspace2: WorkspaceApiData
}

export default MemberProfileApiData
