import Client from '@sx/client'
import Story from '@sx/stories/story'

import {Cleanup, DESCRIPTION, freshClient, integrationClient, uniqueName, unstartedWorkflowStateId} from './helpers/context'


/**
 * Exercises the story lifecycle against the real Shortcut API, entirely through the library's public
 * surface. Every assertion here is one the unit suite cannot make: mocked axios will happily agree
 * with a wrong URL, a body the API would reject, or a field name that never round-trips.
 *
 * These tests create and delete real objects. Point SHORTCUT_API_KEY at a scratch workspace.
 */
describe('story lifecycle', () => {
  let client: Client
  let workflowStateId: number
  const cleanup = new Cleanup()

  beforeAll(async () => {
    client = integrationClient()
    workflowStateId = await unstartedWorkflowStateId(client)
  })

  afterAll(async () => {
    await cleanup.runAll()
  })

  /**
   * Creation goes through `new Story({...}).save()` rather than the client, which also covers the
   * environment-variable fallback in `BaseResource.http`: a directly constructed resource has no
   * client attached and must build one from SHORTCUT_API_KEY.
   */
  it('creates a story, reads it back, and deletes it', async () => {
    const name = uniqueName('story')
    const story = new Story({name, description: DESCRIPTION, storyType: 'chore', workflowStateId})

    await story.save()

    expect(story.id).toEqual(expect.any(Number))
    cleanup.register(`story ${story.id}`, () => story.delete())

    // Round-trip through the client, which is a different code path (service get + field conversion)
    // than the create above, and the one that proves the fields actually persisted server-side.
    const fetched = await client.stories.get(story.id)
    expect(fetched.name).toBe(name)
    expect(fetched.description).toBe(DESCRIPTION)
    expect(fetched.storyType).toBe('chore')
    expect(fetched.workflowStateId).toBe(workflowStateId)
    // snake_case -> camelCase conversion and ISO-string -> Date parsing only ever run against real
    // payloads here, so they are worth asserting explicitly.
    expect(fetched.createdAt).toBeInstanceOf(Date)

    await fetched.delete()

    // Fresh client: `client` has this id memoised from the get above and would hand back the cached
    // object regardless of whether the delete landed.
    await expect(freshClient().stories.get(story.id)).rejects.toThrow()
  })

  it('updates a story and persists only the changed fields', async () => {
    const story = new Story({
      name: uniqueName('story-update'),
      description: DESCRIPTION,
      storyType: 'chore',
      workflowStateId
    })
    await story.save()
    cleanup.register(`story ${story.id}`, () => story.delete())

    const renamed = uniqueName('story-renamed')
    story.name = renamed
    await story.save()

    const fetched = await freshClient().stories.get(story.id)
    expect(fetched.name).toBe(renamed)
    // The update body is built from changedFields, so an untouched field must survive rather than
    // being blanked by a partial PUT.
    expect(fetched.description).toBe(DESCRIPTION)
  })

  it('adds a comment to a story and reads it back', async () => {
    const story = new Story({
      name: uniqueName('story-comment'),
      description: DESCRIPTION,
      storyType: 'chore',
      workflowStateId
    })
    await story.save()
    cleanup.register(`story ${story.id}`, () => story.delete())

    // Fetched through the client so the comment call runs on a client-injected http instance, the
    // path real consumers use.
    const fetched = await client.stories.get(story.id)
    const text = 'Integration test comment'
    const comment = await fetched.comment(text)

    expect(comment.id).toEqual(expect.any(Number))
    expect(comment.text).toBe(text)

    const reloaded = await freshClient().stories.get(story.id)
    expect(reloaded.comments.map(each => each.text)).toContain(text)
  })

  it('adds a task to a story', async () => {
    const story = new Story({
      name: uniqueName('story-task'),
      description: DESCRIPTION,
      storyType: 'chore',
      workflowStateId
    })
    await story.save()
    cleanup.register(`story ${story.id}`, () => story.delete())

    const fetched = await client.stories.get(story.id)
    const description = 'Integration test task'
    await fetched.addTask(description)

    const reloaded = await freshClient().stories.get(story.id)
    expect(reloaded.tasks.map(task => task.description)).toContain(description)
  })

  it('resolves the workflow state of a story', async () => {
    const story = new Story({
      name: uniqueName('story-workflow'),
      description: DESCRIPTION,
      storyType: 'chore',
      workflowStateId
    })
    await story.save()
    cleanup.register(`story ${story.id}`, () => story.delete())

    const fetched = await client.stories.get(story.id)
    const state = await fetched.workflow

    expect(state.id).toBe(workflowStateId)
    // `state()` reads through the same cache; both should agree.
    expect(await fetched.state()).toBe(state.type)
  })

  it('links two stories and removes the link', async () => {
    const first = new Story({
      name: uniqueName('story-link-a'), description: DESCRIPTION, storyType: 'chore', workflowStateId
    })
    const second = new Story({
      name: uniqueName('story-link-b'), description: DESCRIPTION, storyType: 'chore', workflowStateId
    })
    await first.save()
    cleanup.register(`story ${first.id}`, () => first.delete())
    await second.save()
    cleanup.register(`story ${second.id}`, () => second.delete())

    const blocker = await client.stories.get(first.id)
    await blocker.blocks(second.id)

    const reloaded = await freshClient().stories.get(second.id)
    const link = reloaded.storyLinks.find(each => each.objectId === first.id)
    expect(link).toBeDefined()
    expect(link!.verb).toBe('blocks')

    await link!.delete()

    const afterDelete = await freshClient().stories.get(second.id)
    expect(afterDelete.storyLinks.find(each => each.objectId === first.id)).toBeUndefined()
  })

  it('finds a created story via search', async () => {
    const name = uniqueName('story-search')
    const story = new Story({name, description: DESCRIPTION, storyType: 'chore', workflowStateId})
    await story.save()
    cleanup.register(`story ${story.id}`, () => story.delete())

    // Shortcut's search index is not read-your-writes, so this polls rather than asserting once.
    const found = await eventually(async () => {
      const results = await client.stories.search(`"${name}"`)
      return results.results.find(each => each.id === story.id)
    })

    expect(found).toBeDefined()
    expect(found!.name).toBe(name)
  }, 60_000)
})

/**
 * Polls until `attempt` returns something truthy. Used only for search, which is eventually
 * consistent; every other assertion in this suite is immediate and must not be wrapped in this.
 */
async function eventually<T>(attempt: () => Promise<T>, timeoutMs = 45_000, intervalMs = 3_000): Promise<T | undefined> {
  const deadline = Date.now() + timeoutMs

  async function poll(): Promise<T | undefined> {
    const result = await attempt()
    if (result) {
      return result
    }
    if (Date.now() >= deadline) {
      return undefined
    }
    await new Promise(resolve => setTimeout(resolve, intervalMs))
    return poll()
  }

  return poll()
}
