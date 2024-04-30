import ShortcutResource from '@sx/base-resource'
import {ShortcutFieldType} from '@sx/utils/field-type'
import UUID from '@sx/utils/uuid'


/**
 * To make bulk updates to multiple instances of a resource, use the Bundle class. A bundle can be created with a list of instance ids and a
 * factory function that creates a new instance of the resource with the given id. Alternatively, a bundle can be created with a list of instances.
 * In order to make changes to the instances, the bundle object should be used as a proxy object. This will track all changes made to the object
 * and mirror them on the instances. When the `update` method is called, all changes will be sent to the API to update the instances.
 *
 * @example
 * const bundle = new Bundle<Story>({ids: [1, 2, 3]}, (data) => new Story(data))
 * bundle.estimate = 3
 * bundle.update() // Changes are propagated to the instances and sent to the API
 */
class Bundle<R extends ShortcutResource>{
  [key: string]: ShortcutFieldType

  id?: string | number | null | undefined

  public changedFields: string[] = []
  public instanceIds: UUID[] | number[] = []
  public resources: ShortcutResource[]
  public factory: (data: { id: UUID | number }) => R


  /**
   * Create a new Bundle object
   * @param bundled - Either a list of instance ids or a list of instances
   * @param factory - A function that creates a new instance of the resource with the given id, required if bundled is a list of ids
   * @example
   * const bundle = new Bundle<Story>([1, 2, 3], (data) => new Story(data))
   * const otherBundle = new Bundle<Story>([new Story({id: 1}), new Story({id: 2})])
   */
  constructor(bundled: Array<UUID | number> | Array<R>, factory?: (data: { id: UUID | number }) => R){
    // If the bundled parameter is an array of ids, not an array of R, create the resources
    if(Array.isArray(bundled) && typeof bundled[0] === 'number' || typeof bundled[0] ===  'string'){
      this.factory = factory!
      this.instanceIds = <UUID[] | number[]>bundled
      this.#createResources()
    }
    else{
      this.resources = <R[]>bundled
    }
    return new Proxy(this, {
      get(target, property: string | symbol, receiver) {
        return Reflect.get(target, property, receiver)
      },
      set(target, property: string | symbol, value, receiver) {
        // Check that property is defined on R
        if (!Reflect.has(target.resources[0], property)) {
          throw new Error(`Property ${String(property)} is not defined on ${target.resources[0].constructor.name}`)
        }
        // Track all changes made to the object
        if (!target.changedFields.includes(String(property))) {
          target.changedFields.push(String(property))
        }
        return Reflect.set(target, property, value, receiver)
      }
    })
  }

  #createResources(): void {
    this.resources = this.instanceIds.map(id => this.factory({id}))
  }

  public async update(): Promise<void> {
    for (const resource of this.resources) {
      for (const field of this.changedFields) {
        if (field.startsWith('_')) {
          continue
        }
        resource[field] = this[field]
      }
      await resource.update()
    }
  }
}


export default Bundle
