import BaseService, {ServiceOperation} from '@sx/base-service'
import Member from '@sx/members/member'
import MemberInterface from '@sx/members/contracts/member'

export default class MembersService extends BaseService<Member, MemberInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/members'
    protected factory = (data: object) => new Member(data)
    public static members: Record<number, Member> = {}
    public availableOperations: ServiceOperation[] = ['get', 'list']

}
