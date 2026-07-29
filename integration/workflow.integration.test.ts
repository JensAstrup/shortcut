import Client from '@sx/client'

import {integrationClient} from './helpers/context'


describe('workflow', () => {
  let client: Client

  beforeAll(() => {
    client = integrationClient()
  })

  it('lists workflows', async () => {
    const workflows = await client.workflows.list()
    expect(workflows.length).toBeGreaterThan(0)
    expect(workflows[0].states.length).toBeGreaterThan(0)
  })
})
