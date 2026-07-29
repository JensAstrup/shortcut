import Client from '@sx/client'

import {integrationClient} from './helpers/context'


describe('member', () => {
  let client: Client

  beforeAll(() => {
    client = integrationClient()
  })

  it('lists members', async () => {
    const members = await client.members.list()
    expect(members.length).toBeGreaterThan(0)
  })

  it('resolves the authenticated member', async () => {
    const profile = await client.members.getAuthenticatedMemberProfile()
    expect(profile.id).toEqual(expect.any(String))
    // workspace2 is remapped onto `workspace` during conversion, a transform with no unit coverage
    // against a real payload.
    expect(profile.workspace).toBeDefined()

    const member = await client.members.getAuthenticatedMember()
    expect(member.id).toBe(profile.id)
  })
})
