import Client from '@sx/client'
import Iteration from '@sx/iterations/iteration'

import {Cleanup, DESCRIPTION, freshClient, integrationClient, uniqueName} from './helpers/context'


describe('iteration lifecycle', () => {
  let client: Client
  const cleanup = new Cleanup()

  beforeAll(() => {
    client = integrationClient()
  })

  afterAll(async () => {
    await cleanup.runAll()
  })

  it('creates, reads and deletes', async () => {
    const name = uniqueName('iteration')
    // Shortcut requires start/end dates on an iteration, and end must not precede start.
    const startDate = new Date()
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000)
    const iteration = new Iteration({name, description: DESCRIPTION, startDate, endDate})

    await iteration.save()
    expect(iteration.id).toEqual(expect.any(Number))
    cleanup.register(`iteration ${iteration.id}`, () => iteration.delete())

    const fetched = await client.iterations.get(iteration.id)
    expect(fetched.name).toBe(name)
    expect(fetched.startDate).toBeInstanceOf(Date)

    await fetched.delete()
    await expect(freshClient().iterations.get(iteration.id)).rejects.toThrow()
  })
})
