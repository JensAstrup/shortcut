import BaseService from '@sx/base-service'
import Member from '@sx/members/member'

export default class MembersService extends BaseService<Member> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/members'
    protected factory = (data: object) => new Member(data)
    public static members: Record<number, Member> = {}

    public async create(): Promise<void> {
        throw new Error('The API does not support creating members')
    }
}
