import {AxiosInstance} from 'axios'

import BaseInterface from '@sx/base-interface'
import camelToSnake from '@sx/utils/camel-to-snake'
import {ShortcutApiFieldType, ShortcutFieldType} from '@sx/utils/field-type'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {defaultHttpClient} from '@sx/utils/http'
import snakeToCamel from '@sx/utils/snake-to-camel'


/* The possible operations that can be available on a resource */
type ResourceOperation = 'update' | 'create' | 'delete' | 'comment'


/**
 * Base class for all Shortcut resources. Provides methods for creating, updating, and deleting resources.
 * @group Story
 */
abstract class BaseResource<Interface = BaseInterface> {
  [key: string]: ShortcutFieldType

  /**
   * @internal
   * Fields that have been changed, used to determine what to update. It is not recommended to access this property directly.
   */
  public changedFields: string[] = []
  /**
   *  Fields that are used when creating a new resource
   */
  public createFields: string[] = []
  /**
   * The available operations for the resource, any not in this list will raise an error when called
   */
  public availableOperations: ResourceOperation[] = []

  /**
   * Return a Proxy object to intercept property access and set operations on derived classes.
   * The Proxy object will track changes made to the object and store them in the `changedFields` property
   * to be used when updating the resource.
   * @param init - An object containing the initial values for the resource.
   */
  constructor(init?: Interface) {
    if (init) {
      Object.assign(this, init)
    }
    this.changedFields = []
    // Check to ensure that the baseUrl property is overridden in the subclass. Reading the getter is
    // the check: the base implementation throws. Bound to a name so it reads as a deliberate access
    // rather than a statement with no effect.
    if (this.constructor === BaseResource) {
      const _baseUrl = (this.constructor as typeof BaseResource).baseUrl
    }
    return new Proxy(this, {
      get(target, property, receiver): ShortcutFieldType {
        return Reflect.get(target, property, receiver)
      },
      set(target, property, value, receiver): boolean {
        // Track all changes made to the object
        if (!target.changedFields.includes(String(property))) {
          target.changedFields.push(String(property))
        }
        return Reflect.set(target, property, value, receiver)
      }
    })
  }

  /**
   * The base URL for the resource to be used in API requests. This property must be overridden in the subclass.
   * @throws {Error} - Throws an error if the property is not overridden in the subclass.
   */
  static get baseUrl(): string {
    throw new Error('You must override baseUrl in the subclass')
  }

  /**
   * The path for this resource's own requests, relative to the client's base URL.
   *
   * Subclasses are inconsistent about where they declare it: some (Story, Label, Team, Iteration,
   * StoryLink) use `static baseUrl`, while others (Task, Objective, CustomField, LinkedFile,
   * UploadedFile) need a path derived from instance data and declare it on the instance. Resolving
   * both here keeps `update()`, `create()` and `delete()` in agreement — previously `delete()` read
   * only the instance property, so resources with just a static one built a request to
   * `undefined/<id>`.
   *
   * @throws {Error} - Throws if the subclass declares neither form.
   */
  protected get resourceUrl(): string {
    return (this.baseUrl as string | undefined) ?? (this.constructor as typeof BaseResource).baseUrl
  }

  /**
   * @internal
   * Attach the HTTP client that this resource should use for its own requests. Called by services
   * so that a resource keeps making requests as the {@link Client} that fetched it, rather than
   * resolving credentials from the environment at call time.
   *
   * Defined via `Object.defineProperty` rather than assignment: the resource is a Proxy that records
   * every `set` into `changedFields`, and a plain assignment here would leak the client into update
   * request bodies. Subclasses holding child resources should override this to cascade.
   */
  public setHttp(http: AxiosInstance): this {
    Object.defineProperty(this, '_http', {
      value: http,
      writable: true,
      enumerable: false,
      configurable: true
    })
    return this
  }

  /**
   * The HTTP client for this resource's requests. Resources obtained from a {@link Client} use that
   * client's instance; resources constructed directly fall back to one built from the
   * `SHORTCUT_API_KEY` environment variable.
   *
   * @throws {Error} - If no client was attached and `SHORTCUT_API_KEY` is not set
   */
  protected get http(): AxiosInstance {
    const attached = this._http as AxiosInstance | undefined
    if (attached) return attached
    const fallback = defaultHttpClient()
    this.setHttp(fallback)
    return fallback
  }

  /**
   * Update the current instance of the resource with the changed fields.
   * @return {Promise<void>} - A Promise that resolves when the resource has been updated.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async update(): Promise<void> {
    if (!(this.availableOperations.includes('update'))) {
      throw new Error('Update operation not available for this resource')
    }
    // The class index signature widens every property to ShortcutFieldType, so the id is narrowed to
    // what it actually is before being interpolated.
    const url = `${this.resourceUrl}/${this.id as string | number}`
    const body = this.changedFields.reduce((acc: Record<string, unknown>, field) => {
      if (field.startsWith('_')) {
        return acc
      }
      acc[camelToSnake(field)] = this[field]
      return acc
    }, {})

    await this.http.put(url, body)
      .catch((error) => {
        handleResponseFailure(error, body)
      }).then((response) => {
        if (!response) {
          return
        }
        const data: Record<string, ShortcutApiFieldType> = response.data
        Object.keys(data).forEach(key => {
          this[snakeToCamel(key)] = data[key]
          this.changedFields = []
        })
      })
  }

  /**
   * Create a new instance of the resource, using the current object's properties. Use the `xCreateData` interface to determine which fields are available for creation.
   * @return {Promise<this>} - A Promise that resolves with the newly created instance.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async create(): Promise<this> {
    if (!(this.availableOperations.includes('create'))) {
      throw new Error('Create operation not available for this resource')
    }
    const baseUrl = this.resourceUrl
    const body: Record<string, unknown> = {}
    Object.keys(this).forEach(key => {
      if (this.createFields.includes(key)) {
        body[camelToSnake(key)] = this[key]
      }
    })

    const response = await this.http.post(baseUrl, body)
    const HTTP_ERROR = 400
    if (response.status >= HTTP_ERROR) {
      throw new Error('HTTP error ' + response.status)
    }

    return Object.assign(this, response.data)
  }

  /**
   * This method can be overridden by derived classes to perform any necessary operations before saving the resource
   * @protected
   */
  protected async _preSave(): Promise<void> {
  }

  /**
   * Save the current instance of the resource. If the resource already exists (has an ID), it will be updated.
   * Otherwise, it will be created using the fields `createFields`.
   */
  public async save(): Promise<void> {
    await this._preSave()
    if (this.id) {
      await this.update()
    }
    else {
      await this.create()
    }
  }

  /**
   * Delete the current instance of the resource.
   * @return {Promise<void>} - A Promise that resolves when the resource has been deleted.
   * @throws {Error} - Throws an error if the HTTP request fails.
   */
  public async delete(): Promise<void> {
    if (!(this.availableOperations.includes('delete'))) {
      throw new Error('Delete operation not available for this resource')
    }
    const url = `${this.resourceUrl}/${this.id as string | number}`
    const response = await this.http.delete(url).catch((error) => {
      handleResponseFailure(error, {})
    })
    if(!response) {
      throw new Error('Failed to delete resource')
    }
  }
}

export { type ResourceOperation, BaseResource as default }

