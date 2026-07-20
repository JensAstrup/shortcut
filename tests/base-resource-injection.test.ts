import AxiosMockAdapter from 'axios-mock-adapter'

import Story from '@sx/stories/story'
import Task from '@sx/stories/tasks/task'
import {createHttpClient} from '@sx/utils/http'


/**
 * Resources are Proxies that record every property assignment into `changedFields`, and `create()`
 * builds its body from `Object.keys(this)`. Attaching the HTTP client therefore has to be invisible
 * to both, or the client would leak into outgoing request bodies.
 */
describe('BaseResource HTTP client injection', () => {
  it('does not record the client as a changed field', () => {
    const story = new Story({id: 1, name: 'orig'}).setHttp(createHttpClient('tok'))

    expect(story.changedFields).toEqual([])
  })

  it('keeps the client out of enumerable keys and serialization', () => {
    const story = new Story({id: 1, name: 'orig'}).setHttp(createHttpClient('tok'))

    expect(Object.keys(story)).not.toContain('_http')
    expect(JSON.stringify(story)).not.toContain('_http')
  })

  it('sends only genuinely changed fields in the update body', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onPut('/stories/1').reply(200, {})
    const story = new Story({id: 1, name: 'orig'}).setHttp(http)
    story.availableOperations = ['update']
    story.changedFields = []

    story.name = 'changed'
    await story.update()

    expect(JSON.parse(mock.history.put[0].data)).toEqual({name: 'changed'})
  })

  it('cascades the client to child resources built in the constructor', () => {
    const http = createHttpClient('tok')

    const story = new Story({id: 1, tasks: [{id: 9, storyId: 1}]}).setHttp(http)

    const task = (story.tasks)[0]
    expect(task).toBeInstanceOf(Task)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((task as any)._http).toBe(http)
  })

  it('does not leave baseUrl marked as changed on resources that derive it from instance data', async () => {
    const http = createHttpClient('tok')
    const mock = new AxiosMockAdapter(http)
    mock.onPut('/stories/1/tasks/9').reply(200, {})
    // Task already permits 'update'; assigning availableOperations here would itself register as a
    // changed field and mask what this test is checking.
    const task = new Task({id: 9, storyId: 1, description: 'orig'}).setHttp(http)

    task.description = 'changed'
    await task.update()

    expect(JSON.parse(mock.history.put[0].data)).toEqual({description: 'changed'})
  })
})
