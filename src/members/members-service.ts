import axios, {AxiosResponse} from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import MemberInterface from '@sx/members/contracts/member'
import {MemberProfile} from '@sx/members/contracts/member-profile'
import MemberProfileApiData from '@sx/members/contracts/member-profile-api-data'
import Member from '@sx/members/member'
import {convertApiFields} from '@sx/utils/convert-fields'


class MembersService extends BaseService<Member, MemberInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/members'
  protected factory = (data: object) => new Member(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  async getAuthenticatedMember(): Promise<MemberProfile> {
    const apiUrl: string = 'https://api.app.shortcut.com/api/v3/member'
    const response: AxiosResponse = await axios.get(apiUrl, {headers: this.headers})
    const memberData = response.data as MemberProfileApiData
    return convertApiFields(memberData) as MemberProfile
  }

}

export default MembersService
