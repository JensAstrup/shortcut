import axios, {AxiosResponse} from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import MemberInterface from '@sx/members/contracts/member'
import {MemberProfile} from '@sx/members/contracts/member-profile'
import MemberProfileApiData from '@sx/members/contracts/member-profile-api-data'
import Member from '@sx/members/member'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import WorkspaceInterface from '@sx/workspace/contracts/workspace'


class MembersService extends BaseService<Member, MemberInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/members'
  protected factory = (data: object) => new Member(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  async getAuthenticatedMember(): Promise<Member>{
    const profile: MemberProfile = await this.getAuthenticatedMemberProfile()
    return await this.get(profile.id)
  }

  async getAuthenticatedMemberProfile(): Promise<MemberProfile> {
    const apiUrl: string = 'https://api.app.shortcut.com/api/v3/member'
    const response: AxiosResponse | void = await axios.get(apiUrl, {headers: this.headers}).catch(error => {
      handleResponseFailure(error, {})
    })
    if(!response) throw new Error('Failed to get member profile')
    const memberData = response.data as MemberProfileApiData
    const profile: MemberProfile = convertApiFields(memberData) as MemberProfile
    profile.workspace = convertApiFields(memberData.workspace2) as WorkspaceInterface
    return profile
  }

}

export default MembersService
