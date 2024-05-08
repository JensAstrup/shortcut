import BaseResource from '@sx/base-resource'
import UUID from '@sx/utils/uuid'

import Bundle from '../src/bundle'

// Mocks for BaseResource and UUID
class Story extends BaseResource {
  id: UUID | number
  estimate?: number

  constructor(data: { id: UUID | number }) {
    super()
    this.id = data.id
  }

  update() {
    return Promise.resolve()
  }
}

describe('Bundle class', () => {
  it('should initialize with instance IDs and a factory function', () => {
    const ids = ['123A', '123B', '123C']
    const bundle = new Bundle<Story>(ids, data => new Story(data))
    expect(bundle.instanceIds).toEqual(ids)
    expect(bundle.resources.length).toBe(3)
    expect(bundle.factory).toBeInstanceOf(Function)
  })

  it('should initialize with instances directly', () => {
    const stories = [new Story({id: '123A'}), new Story({id: '123B'})]
    const bundle = new Bundle<Story>(stories)
    expect(bundle.resources).toEqual(stories)
  })

  it('should proxy property sets to all resources', async () => {
    const stories = [new Story({id: 1}), new Story({id: 2})]
    const bundle = new Bundle<Story>(stories)
    bundle.estimate = 5
    expect(bundle.estimate).toBe(5)
    await bundle.update()
    expect(stories[0].estimate).toBe(5)
    expect(stories[1].estimate).toBe(5)
  })

  it('should track changes made through the proxy', () => {
    const bundle = new Bundle<Story>(['123A'], ({id}) => new Story({id}))
    bundle.estimate = 3
    expect(bundle.changedFields).toContain('estimate')
  })

  it('should update all instances via the API when update is called', async () => {
    const stories = [new Story({id: 1}), new Story({id: 2})]
    jest.spyOn(stories[0], 'update').mockResolvedValue()
    jest.spyOn(stories[1], 'update').mockResolvedValue()

    const bundle = new Bundle<Story>(stories)
    bundle.estimate = 3
    await bundle.update()

    expect(stories[0].update).toHaveBeenCalled()
    expect(stories[1].update).toHaveBeenCalled()
    expect(stories[0].estimate).toBe(3)
    expect(stories[1].estimate).toBe(3)
  })

  it('should not update properties starting with underscore', async () => {
    const story = new Story({id: 1})
    story._private = 1

    const bundle = new Bundle<Story>([story])
    bundle._private = 2
    await bundle.update()

    expect(story._private).toBe(1) // unchanged
  })

  it('throws an error if trying to set a property not defined on the resource', () => {
    const bundle = new Bundle<Story>([new Story({id: 1})])
    expect(() => {
      bundle.nonExistentProp = 10
    }).toThrow()
  })
})
