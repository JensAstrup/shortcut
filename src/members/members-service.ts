import BaseService, {ServiceOperation} from '@sx/base-service'
import MemberInterface, {MemberProfile, MemberState} from '@sx/members/contracts/member'
import Member from '@sx/members/member'


export default class MembersService extends BaseService<Member, MemberInterface> implements MemberInterface {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/members'
  protected factory = (data: object) => new Member(data)
  public static members: Record<number, Member> = {}
  public availableOperations: ServiceOperation[] = ['get', 'list']

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
