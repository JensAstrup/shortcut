import Client from '@sx/client'
import {WorkflowStateType} from '@sx/workflow-states/contracts/workflow-state-interface'


/**
 * Names every object this suite creates with a common prefix and a unique suffix. The prefix makes
 * anything left behind by a crashed run findable in the Shortcut UI; the suffix keeps parallel or
 * repeated runs from colliding on uniqueness constraints (label names, for one, must be unique).
 */
const RESOURCE_PREFIX = 'sdk-integration-test'

const RANDOM_SUFFIX_RANGE = 1_000_000

function uniqueName(label: string): string {
  const random = Math.floor(Math.random() * RANDOM_SUFFIX_RANGE)
  return `${RESOURCE_PREFIX} ${label} ${Date.now()}-${random}`
}

const DESCRIPTION = 'Created by the shortcut-api integration suite. Safe to delete.'

/**
 * Builds the client under test from the environment.
 *
 * Deliberately not defaulted: an integration run mutates a real workspace, so it should fail loudly
 * rather than fall back to some ambient credential.
 */
function integrationClient(): Client {
  const apiKey = process.env.SHORTCUT_API_KEY
  if (!apiKey) {
    throw new Error(
      'SHORTCUT_API_KEY must be set to run the integration suite. ' +
      'Use a token for a scratch workspace: these tests create and delete real objects.'
    )
  }
  return new Client(apiKey)
}

/**
 * A client with an empty service cache.
 *
 * `BaseService.get()` memoises by id in `this.instances` and nothing ever evicts, so a second `get`
 * for the same id on the same client returns the object as it looked the first time — before any
 * comment, link, update or delete. Assertions about server state therefore have to come from a
 * client that has not seen the resource yet, or they are just reading a local cache back.
 */
function freshClient(): Client {
  return integrationClient()
}

/**
 * Anything registered here is deleted after the suite, newest first so that children come off before
 * their parents. Registration happens immediately after each create rather than at the end of a
 * test, so a failed assertion mid-test still leaves a cleanable trail.
 *
 * Deletion goes through the library's own `delete()`, which means cleanup is itself exercising the
 * code under test. That is intentional — a delete that silently no-ops shows up as objects piling up
 * in the workspace, and the explicit "is it gone" assertions in the suite catch it directly.
 */
class Cleanup {
  private readonly items: {label: string, remove: () => Promise<unknown>}[] = []

  register(label: string, remove: () => Promise<unknown>): void {
    this.items.push({label, remove})
  }

  async runAll(): Promise<void> {
    const failures: string[] = []
    for (const {label, remove} of [...this.items].reverse()) {
      try {
        await remove()
      }
      catch (error) {
        // A resource the test already deleted comes back 404, which means cleanup has nothing to do
        // rather than that something leaked. Only other failures are worth reporting.
        const alreadyGone = error instanceof Error
          && (error.message.includes('404') || error.message.includes('Failed to delete resource'))
        if (!alreadyGone) {
          failures.push(`${label}: ${String(error)}`)
        }
      }
    }
    this.items.length = 0
    if (failures.length) {
      // Warned, not thrown: cleanup trouble must not overwrite the actual test result, but it does
      // need to be visible so leaked objects get noticed.
      console.warn(
        `Integration cleanup could not remove some objects (they may already be gone):\n  ${failures.join('\n  ')}`
      )
    }
  }
}

/**
 * Resolves a workflow state to create stories in. `POST /stories` needs a `workflow_state_id`, and
 * the ids are workspace-specific, so this is discovered at runtime rather than hardcoded.
 */
async function unstartedWorkflowStateId(client: Client): Promise<number> {
  const workflows = await client.workflows.list()
  const states = workflows.flatMap(workflow => workflow.states ?? [])
  if (!states.length) {
    throw new Error('Workspace has no workflow states, so stories cannot be created')
  }
  const unstarted = states.find(state => state.type === WorkflowStateType.UNSTARTED)
  return (unstarted ?? states[0]).id
}

export {Cleanup, DESCRIPTION, freshClient, integrationClient, RESOURCE_PREFIX, uniqueName, unstartedWorkflowStateId}
