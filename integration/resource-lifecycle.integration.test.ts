import Client from '@sx/client'
import Epic from '@sx/epics/epic'
import Iteration from '@sx/iterations/iteration'
import Label from '@sx/labels/label'

import {Cleanup, DESCRIPTION, freshClient, integrationClient, uniqueName} from './helpers/context'


/**
 * Create/get/delete for the resources other than Story. Each block is independent so a failure in
 * one resource does not hide the others.
 */
describe('resource lifecycles', () => {
  let client: Client
  const cleanup = new Cleanup()

  beforeAll(() => {
    client = integrationClient()
  })

  afterAll(async () => {
    await cleanup.runAll()
  })

  describe('label', () => {
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

  describe('epic', () => {
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

  describe('iteration', () => {
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

  describe('read-only services', () => {
    it('lists workflows and members', async () => {
      const workflows = await client.workflows.list()
      expect(workflows.length).toBeGreaterThan(0)
      expect(workflows[0].states.length).toBeGreaterThan(0)

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
})
