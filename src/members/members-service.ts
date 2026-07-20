import {AxiosResponse} from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import MemberInterface from '@sx/members/contracts/member-interface'
import {MemberProfile} from '@sx/members/contracts/member-profile'
import MemberProfileApiData from '@sx/members/contracts/member-profile-api-data'
import Member from '@sx/members/member'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import WorkspaceInterface from '@sx/workspace/contracts/workspace'
import WorkspaceApiData from '@sx/workspace/contracts/workspace-api-data'


class MembersService extends BaseService<Member, MemberInterface> {
  public baseUrl = '/members'
  protected factory = (data: object): Member => new Member(data)
  public availableOperations: ServiceOperation[] = ['get', 'list']

  async getAuthenticatedMember(): Promise<Member>{
    const profile: MemberProfile = await this.getAuthenticatedMemberProfile()
    return await this.get(profile.id)
  }

  async getAuthenticatedMemberProfile(): Promise<MemberProfile> {
    const apiUrl: string = '/member'
    const response: AxiosResponse | void = await this.http.get(apiUrl).catch(error => {
      handleResponseFailure(error, {})
    })
    if(!response) throw new Error('Failed to get member profile')
    const memberData = response.data as MemberProfileApiData
    const profile: MemberProfile = convertApiFields(memberData)
    profile.workspace = convertApiFields<WorkspaceApiData, WorkspaceInterface>(memberData.workspace2)
    return profile
  }

}

export default MembersService
