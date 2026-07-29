import Client from '@sx/client'
import Epic from '@sx/epics/epic'

import {Cleanup, DESCRIPTION, freshClient, integrationClient, uniqueName} from './helpers/context'


describe('epic lifecycle', () => {
  let client: Client
  const cleanup = new Cleanup()

  beforeAll(() => {
    client = integrationClient()
  })

  afterAll(async () => {
    await cleanup.runAll()
  })

  it('creates, reads, comments and deletes', async () => {
    const name = uniqueName('epic')
    const epic = new Epic({name, description: DESCRIPTION})

    await epic.save()
    expect(epic.id).toEqual(expect.any(Number))
    cleanup.register(`epic ${epic.id}`, () => epic.delete())

    const fetched = await client.epics.get(epic.id)
    expect(fetched.name).toBe(name)
    expect(fetched.description).toBe(DESCRIPTION)

    const text = 'Integration test epic comment'
    // Epic.comment resolves to void when the request fails, so this asserts a comment came back at
    // all before touching its fields.
    const comment = await fetched.comment(text)
    expect(comment).toBeTruthy()
    expect(comment!.id).toEqual(expect.any(Number))

    await fetched.delete()
    await expect(freshClient().epics.get(epic.id)).rejects.toThrow()
  })
})
