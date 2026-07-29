import Client from '@sx/client'
import Label from '@sx/labels/label'

import {Cleanup, DESCRIPTION, freshClient, integrationClient, uniqueName} from './helpers/context'


describe('label lifecycle', () => {
  let client: Client
  const cleanup = new Cleanup()

  beforeAll(() => {
    client = integrationClient()
  })

  afterAll(async () => {
    await cleanup.runAll()
  })

  it('creates, reads, updates and deletes', async () => {
    const name = uniqueName('label')
    const label = new Label({name, description: DESCRIPTION, color: '#ff0000'})

    await label.save()
    expect(label.id).toEqual(expect.any(Number))
    cleanup.register(`label ${label.id}`, () => label.delete())

    const listed = await client.labels.list()
    expect(listed.map(each => each.name)).toContain(name)

    // getByName is a convenience wrapper over list(); worth covering because it filters client-side
    // and would silently return null if the field conversion changed.
    const byName = await client.labels.getByName(name)
    expect(byName).not.toBeNull()
    expect(byName!.id).toBe(label.id)

    const renamed = uniqueName('label-renamed')
    label.name = renamed
    await label.save()
    // getByName goes through list(), which repopulates the whole instances cache, so a fresh
    // client is used to be sure this reflects the server rather than the pre-rename snapshot.
    expect((await freshClient().labels.getByName(renamed))?.id).toBe(label.id)

    await label.delete()
    expect(await freshClient().labels.getByName(renamed)).toBeNull()
  })
})
