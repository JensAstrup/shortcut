import WorkspaceApiData from '@sx/workspace/contracts/workspace-api-data'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import MemberProfileApiData from '@sx/members/contracts/member-profile-api-data'
import MembersService from '@sx/members/members-service'


const axiosMock = new AxiosMockAdapter(axios)

describe('MembersService', () => {
  it('should return authenticated member profile', async () => {
    const workspace = {url_slug: 'test-workspace', estimate_scale: [1, 2, 3], } as WorkspaceApiData
    const memberData = {id: 'UUID1', name: 'Test Member', mention_name: 'TestMember', workspace2: workspace, deactivated: false, display_icon: '', email_address: 'test@member.com', gravatar_hash: 'hash', is_owner: false, two_factor_auth_enabled: true} as MemberProfileApiData
    axiosMock.onGet().reply(200, memberData)
    const membersService = new MembersService({headers: {}})
    const memberProfile = await membersService.getAuthenticatedMember()
    expect(memberProfile.id).toBe('UUID1')
    expect(memberProfile.name).toBe('Test Member')
    expect(memberProfile.mentionName).toBe('TestMember')
    expect(memberProfile.workspace).toEqual({urlSlug: 'test-workspace', estimateScale: [1, 2, 3]})
  })
})
