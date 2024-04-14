import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import MemberProfileApiData from '@sx/members/contracts/member-profile-api-data'
import MembersService from '@sx/members/members-service'


const axiosMock = new AxiosMockAdapter(axios)

describe('MembersService', () => {
  it('should return authenticated member profile', async () => {
    axiosMock.onGet().reply(200, {id: 'UUID1', name: 'Test Member', mention_name: 'TestMember'} as MemberProfileApiData)
    const membersService = new MembersService({headers: {}})
    const memberProfile = await membersService.getAuthenticatedMember()
    expect(memberProfile.id).toBe('UUID1')
    expect(memberProfile.name).toBe('Test Member')
    expect(memberProfile.mentionName).toBe('TestMember')
  })
})
