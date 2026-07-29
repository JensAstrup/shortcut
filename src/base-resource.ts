import {AxiosError, AxiosInstance} from 'axios'

import BaseInterface from '@sx/base-interface'
import camelToSnake from '@sx/utils/camel-to-snake'
import Constructor from '@sx/utils/constructor'
import {ShortcutApiFieldType, ShortcutFieldType} from '@sx/utils/field-type'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {defaultHttpClient} from '@sx/utils/http'
import snakeToCamel from '@sx/utils/snake-to-camel'


/**
 * The capability-free heart of every resource: the write-tracking Proxy, the changed-field log, the
 * HTTP client plumbing and URL resolution, and the shared field serializer. It carries no
 * create/update/delete/save methods — those are added by the {@link Updatable}, {@link Creatable} and
 * {@link Deletable} mixins. Not intended to be instantiated directly; obtain a bound constructor
 * through {@link ResourceBaseFor}.
 * @group Story
 */
abstract class ResourceCore<Interface = BaseInterface> {
  [key: string]: ShortcutFieldType

  /**
   * @internal
   * Fields that have been changed, used to determine what to update. It is not recommended to access this property directly.
   */
  public changedFields: string[] = []
  /**
   * @internal
   * Fields serialized as date-only (`YYYY-MM-DD`) in create/update bodies rather than as a full ISO
   * timestamp. Some Shortcut endpoints (e.g. iteration `start_date`/`end_date`) reject a datetime.
   *
   * `public` (rather than `protected`) because TypeScript's declaration emitter cannot describe a
   * `protected`/`private` member inherited — but not redeclared — through an anonymous mixin class
   * expression on an exported leaf class (TS4094). The mixins below inherit this chain, so every
   * member they rely on that isn't redeclared at the leaf has to be public.
   */
  public dateOnlyFields: string[] = []

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
   *
   * @internal
   * `public` rather than `protected` — see the note on {@link dateOnlyFields} about TS4094.
   */
  public get resourceUrl(): string {
    return (this.baseUrl as string | undefined) ?? (this.constructor as typeof ResourceCore).baseUrl
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
   *
   * @internal
   * `public` rather than `protected` — see the note on {@link dateOnlyFields} about TS4094.
   */
  public get http(): AxiosInstance {
    const attached = this._http as AxiosInstance | undefined
    if (attached) return attached
    const fallback = defaultHttpClient()
    this.setHttp(fallback)
    return fallback
  }

  /**
   * @internal
   * Serializes a field's value for a create/update body, formatting `Date` values listed in
   * `dateOnlyFields` as `YYYY-MM-DD` instead of a full ISO timestamp. `public` (rather than
   * `private`/`protected`) so the capability mixins below, which are subclasses, can call it — see
   * the note on {@link dateOnlyFields} about TS4094.
   */
  public serializeFieldValue(field: string, value: ShortcutFieldType): unknown {
    if (value instanceof Date && this.dateOnlyFields.includes(field)) {
      const [dateOnly] = value.toISOString().split('T')
      return dateOnly
    }
    return value
  }

  /**
   * @internal
   * This method can be overridden by derived classes to perform any necessary operations before saving the resource.
   *
   * `public` rather than `protected` — see the note on {@link dateOnlyFields} about TS4094.
   */
  public async _preSave(): Promise<void> {
  }
}


/* ------------------------------------------------------------------ *
 *  Factory + mixin plumbing                                          *
 * ------------------------------------------------------------------ */

type ResourceConstructor = Constructor<ResourceCore>

/**
 * Supply the resource's interface once, then compose the capabilities you need:
 *
 * ```ts
 * class Epic extends Deletable(Creatable(Updatable(ResourceBaseFor<EpicInterface>())))
 *   implements EpicInterface { ... }
 * ```
 *
 * The returned constructor is non-abstract and newable so it can seed a mixin chain.
 */
function ResourceBaseFor<Interface = BaseInterface>(): new (init?: Interface) => ResourceCore<Interface> {
  return ResourceCore as unknown as new (init?: Interface) => ResourceCore<Interface>
}


/* ------------------------------------------------------------------ *
 *  save() dispatch (shared by Creatable and Updatable)               *
 * ------------------------------------------------------------------ */

interface Persistable {
  id?: ShortcutFieldType
  _preSave(): Promise<void>
  update?(): Promise<void>
  create?(): Promise<unknown>
}

/**
 * Runs `_preSave`, then dispatches: an existing (id-bearing) resource updates, a new one creates.
 * Guarded by method presence so `save()` works whether the resource is create-only, update-only, or
 * both — an update-only resource with no id still updates, since it has no `create` to fall back to.
 * A resource that is neither cannot reach this function — it has no `save()`.
 */
async function persistResource(resource: Persistable): Promise<void> {
  await resource._preSave()
  if (typeof resource.update === 'function' && (resource.id || typeof resource.create !== 'function')) {
    await resource.update()
    return
  }
  if (typeof resource.create === 'function') {
    await resource.create()
    return
  }
  throw new Error('Resource is neither creatable nor updatable')
}


/* ------------------------------------------------------------------ *
 *  Capability mixins                                                 *
 * ------------------------------------------------------------------ */

interface UpdatableMembers {
  update(): Promise<void>
  save(): Promise<void>
}

interface CreatableMembers {
  createFields: string[]
  create(): Promise<unknown>
  save(): Promise<void>
}

interface DeletableMembers {
  delete(): Promise<void>
}

/** Adds `update()` and `save()`. */
function Updatable<TBase extends ResourceConstructor>(Base: TBase): TBase & Constructor<UpdatableMembers> {
  class UpdatableResource extends Base {
    /**
     * Update the current instance of the resource with the changed fields.
     * @return {Promise<void>} - A Promise that resolves when the resource has been updated.
     * @throws {Error} - Throws an error if the HTTP request fails.
     */
    public async update(): Promise<void> {
      // The class index signature widens every property to ShortcutFieldType, so the id is narrowed to
      // what it actually is before being interpolated.
      const url = `${this.resourceUrl}/${this.id as string | number}`
      const body = this.changedFields.reduce((acc: Record<string, unknown>, field) => {
        if (field.startsWith('_')) {
          return acc
        }
        acc[camelToSnake(field)] = this.serializeFieldValue(field, this[field])
        return acc
      }, {})

      await this.http.put(url, body)
        .catch((error: AxiosError) => {
          handleResponseFailure(error, body)
        }).then((response) => {
          if (!response) {
            return
          }
          const data: Record<string, ShortcutApiFieldType> = response.data as Record<string, ShortcutApiFieldType>
          Object.keys(data).forEach(key => {
            this[snakeToCamel(key)] = data[key]
          })
          // Cleared once after the writes rather than on every iteration; each assignment above goes
          // through the Proxy and re-adds to changedFields, so this has to come last either way.
          this.changedFields = []
        })
    }

    /**
     * Save the current instance of the resource. If the resource already exists (has an ID), it will be updated.
     * Otherwise, if the resource is also creatable, it will be created using the fields `createFields`.
     */
    public async save(): Promise<void> {
      return persistResource(this)
    }
  }
  return UpdatableResource
}

/** Adds `createFields`, `create()` and `save()`. */
function Creatable<TBase extends ResourceConstructor>(Base: TBase): TBase & Constructor<CreatableMembers> {
  class CreatableResource extends Base {
    /**
     *  Fields that are used when creating a new resource
     */
    public createFields: string[] = []

    /**
     * Create a new instance of the resource, using the current object's properties. Use the `xCreateData` interface to determine which fields are available for creation.
     * @return {Promise<this>} - A Promise that resolves with the newly created instance.
     * @throws {Error} - Throws an error if the HTTP request fails.
     */
    public async create(): Promise<this> {
      const baseUrl = this.resourceUrl
      const body: Record<string, unknown> = {}
      Object.keys(this).forEach(key => {
        if (this.createFields.includes(key)) {
          body[camelToSnake(key)] = this.serializeFieldValue(key, this[key])
        }
      })

      // Unlike update(), a failed create rejects rather than resolving, so the error is caught here to
      // report which fields the API objected to. Previously this surfaced as a bare "422" with the
      // response body discarded, which says nothing about what was wrong with the request.
      const response = await this.http.post(baseUrl, body).catch((error: AxiosError) => {
        handleResponseFailure(error, body)
        throw new Error(
          `Error creating resource: HTTP ${error.response?.status} ${JSON.stringify(error.response?.data)}`,
          {cause: error}
        )
      })
      const HTTP_ERROR = 400
      if (response.status >= HTTP_ERROR) {
        throw new Error('HTTP error ' + response.status + ' ' + JSON.stringify(response.data))
      }

      // Mirrors update(): the response is raw API JSON, so keys are converted before being applied.
      // `Object.assign(this, response.data)` would write snake_case properties alongside the existing
      // camelCase ones, and — because the instance is a Proxy that records every write — would leave
      // every one of those keys in changedFields. The next save() then PUTs the whole object and the
      // API rejects it with "disallowed-key" for the read-only fields.
      const data: Record<string, ShortcutApiFieldType> = response.data as Record<string, ShortcutApiFieldType>
      Object.keys(data).forEach(key => {
        this[snakeToCamel(key)] = data[key]
      })
      // Cleared after the writes above, not during, so the freshly created resource starts clean.
      this.changedFields = []

      return this
    }

    /**
     * Save the current instance of the resource. If the resource already exists (has an ID) and is
     * also updatable, it will be updated. Otherwise, it will be created using the fields `createFields`.
     */
    public async save(): Promise<void> {
      return persistResource(this)
    }
  }
  return CreatableResource
}

/** Adds `delete()`. */
function Deletable<TBase extends ResourceConstructor>(Base: TBase): TBase & Constructor<DeletableMembers> {
  class DeletableResource extends Base {
    /**
     * Delete the current instance of the resource.
     * @return {Promise<void>} - A Promise that resolves when the resource has been deleted.
     * @throws {Error} - Throws an error if the HTTP request fails.
     */
    public async delete(): Promise<void> {
      const url = `${this.resourceUrl}/${this.id as string | number}`
      const response = await this.http.delete(url).catch((error: AxiosError) => {
        handleResponseFailure(error, {})
      })
      if (!response) {
        throw new Error('Failed to delete resource')
      }
    }
  }
  return DeletableResource
}


export {
  Creatable,
  type CreatableMembers,
  Deletable,
  type DeletableMembers,
  type Persistable,
  ResourceCore,
  ResourceBaseFor,
  Updatable,
  type UpdatableMembers
}
