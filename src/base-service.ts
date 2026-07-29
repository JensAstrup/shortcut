import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import BaseData from '@sx/base-data'
import BaseInterface from '@sx/base-interface'
import { ResourceCore } from '@sx/base-resource'
import Constructor from '@sx/utils/constructor'
import { convertApiFields } from '@sx/utils/convert-fields'
import { ShortcutApiFieldType } from '@sx/utils/field-type'
import { normalizeNext } from '@sx/utils/http'
import SearchResponse, { SearchableService } from '@sx/utils/search-response'
import UUID from '@sx/utils/uuid'


// ---------------------------------------------------------------------------
// Mixin plumbing
// ---------------------------------------------------------------------------

/** Extract the instance type of a constructor. */
type InstanceOf<T> = T extends Constructor<infer I> ? I : never

/**
 * `ServiceBase`'s `factory` field uses `Interface` in a parameter (contravariant) position, so a
 * concrete instantiation like `ServiceBase<Epic, EpicInterface>` is not structurally assignable to a
 * fixed bound like `ServiceBase<ResourceCore, BaseInterface>` under `strictFunctionTypes`. Mixin
 * constraints are written against this fully-open instantiation instead — `any` short-circuits
 * variance checking for the constraint check, while generic inference at each call site still
 * captures the precise `Resource`/`Interface` pair from the argument's actual type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyServiceBase = ServiceBase<any, any>

/** The [Resource, Interface] pair a service base was parameterised with. */
type ServiceGenerics<T> = InstanceOf<T> extends ServiceBase<infer R, infer I> ? [R, I] : never
type ResourceOf<T> = ServiceGenerics<T>[0]
type InterfaceOf<T> = ServiceGenerics<T>[1]

/** Structural capability interfaces — the compile-time contract each mixin adds. */
interface GettableService<Resource extends ResourceCore> {
  get(id: string | number): Promise<Resource>
  getMany(ids: UUID[] | number[]): Promise<Resource[]>
}

interface ListableService<Resource extends ResourceCore> {
  list(): Promise<Resource[]>
}


// ---------------------------------------------------------------------------
// Core base — holds state only, no operation methods, no availableOperations
// ---------------------------------------------------------------------------

class ServiceBase<Resource extends ResourceCore, Interface extends BaseInterface> {
  /** The path of the resource, relative to the base URL configured on {@link http}. */
  public baseUrl = ''
  /** The pre-authenticated HTTP client shared with the {@link Client} that created this service. */
  public readonly http: AxiosInstance
  protected factory: (data: Interface) => Resource
  protected instances: Record<string, Resource> = {}

  /**
   * Service classes are not intended to be instantiated directly. Instead, use the {@link Client}
   * class to create instances of services.
   */
  constructor(init: { http: AxiosInstance }) {
    this.http = init.http
  }

  /**
   * Build a resource from interface data, handing it the HTTP client so that any requests it makes
   * are authenticated as the same client that fetched it.
   */
  protected build(data: Interface): Resource {
    return this.factory(data).setHttp(this.http)
  }
}

/**
 * A base constructor bound to a concrete Resource/Interface pair. This is the one place the generics
 * are supplied; the mixins below re-infer them from whatever base they are handed, so no per-layer
 * type arguments are needed at the composition site.
 *
 * @example
 * class LabelsService extends Listable(Gettable(ServiceBaseFor<Label, LabelInterface>())) {}
 */
function ServiceBaseFor<Resource extends ResourceCore, Interface extends BaseInterface>(): Constructor<ServiceBase<Resource, Interface>> {
  return ServiceBase
}


// ---------------------------------------------------------------------------
// Capability mixins
// ---------------------------------------------------------------------------

const HTTP_ERROR = 400

/** Adds `get()` and `getMany()`. */
function Gettable<TBase extends Constructor<AnyServiceBase>>(
  Base: TBase
): TBase & Constructor<GettableService<ResourceOf<TBase>>> {
  class GettableMixin extends Base {
    public async get(id: string | number): Promise<ResourceOf<TBase>> {
      if (id in this.instances) {
        return this.instances[id] as ResourceOf<TBase>
      }
      const url = `${this.baseUrl}/${id}`
      const response = await this.http.get(url)
      if (response.status >= HTTP_ERROR) {
        throw new Error('HTTP error ' + response.status)
      }
      const instanceData = convertApiFields<BaseData, InterfaceOf<TBase>>(response.data as BaseData)
      const instance = this.build(instanceData) as ResourceOf<TBase>
      this.instances[id] = instance
      return instance
    }

    public async getMany(ids: UUID[] | number[]): Promise<Array<ResourceOf<TBase>>> {
      return Promise.all(ids.map(id => this.get(id)))
    }
  }
  return GettableMixin
}

/** Adds `list()`. */
function Listable<TBase extends Constructor<AnyServiceBase>>(
  Base: TBase
): TBase & Constructor<ListableService<ResourceOf<TBase>>> {
  class ListableMixin extends Base {
    public async list(): Promise<Array<ResourceOf<TBase>>> {
      const response: AxiosResponse = await this.http.get(this.baseUrl)
      if (response.status >= HTTP_ERROR) {
        throw new Error('HTTP error ' + response.status)
      }
      const instancesData: Record<string, ShortcutApiFieldType>[] = response.data as Record<string, ShortcutApiFieldType>[] ?? []
      const resources = instancesData.map(instance => this.build(convertApiFields<BaseData, InterfaceOf<TBase>>(instance)) as ResourceOf<TBase>)
      this.instances = resources.reduce((acc: Record<string, ResourceOf<TBase>>, resource) => {
        let id: string = resource.id as string
        if (!isNaN(Number(resource.id))) {
          id = Number(resource.id).toString()
        }
        acc[id] = resource
        return acc
      }, {})
      return resources
    }
  }
  return ListableMixin
}

interface SearchApiResponse {
  query: string
  next: string
  data?: BaseData[]
}

/** Adds `search()`. */
function Searchable<TBase extends Constructor<AnyServiceBase>>(
  Base: TBase
): TBase & Constructor<SearchableService<ResourceOf<TBase>, InterfaceOf<TBase>>> {
  class SearchableMixin extends Base {
    /**
     * Search for resources using the [Shortcut Syntax](https://help.shortcut.com/hc/en-us/articles/360000046646-Searching-in-Shortcut-Using-Search-Operators)
     *
     * @example
     * ```typescript
     * const client = new Client()
     * const epics = client.epic.search('My epic')
     * const stories = client.story.search('team:platform')
     * const objectives = client.objective.search({team_id: 123})
     * const iterations = client.iteration.search('team:platform')
     * ```
     *
     * @throws Error if the HTTP status code is 400 or greater
     * @param query - The search query to use
     * @param next - The next page token to use for pagination
     */
    public async search(query: string, next?: string): Promise<SearchResponse<ResourceOf<TBase>, InterfaceOf<TBase>>> {
      const pathSegments = this.baseUrl.split('/')
      const resource = pathSegments.pop()
      // `next` is returned by the API as a path that already includes the version prefix, so it is
      // normalized rather than appended to the client's base URL.
      const url = next
        ? normalizeNext(next)
        : `/search/${resource}?${new URLSearchParams({ query: query }).toString()}`

      try {
        const response = await this.http.get(url)

        if (response.status >= HTTP_ERROR) {
          throw new Error('HTTP error ' + response.status + ' (' + response.statusText + ') ' + JSON.stringify(response.data))
        }
        const responseData = response.data as SearchApiResponse
        const nextPage = responseData.next
        const resourceData: BaseData[] = responseData.data ?? []
        return new SearchResponse<ResourceOf<TBase>, InterfaceOf<TBase>>({
          query: query,
          next: nextPage,
          results: resourceData.map(r => this.build(convertApiFields<BaseData, InterfaceOf<TBase>>(r)) as ResourceOf<TBase>),
          service: this
        })
      }
      catch (e) {
        if (e instanceof AxiosError) {
          // An AxiosError carries the request config, so `error.cause` would otherwise hand the
          // Shortcut-Token to anything that logs it. The header is redacted before the error is chained,
          // which keeps the original stack for debugging without leaking the credential.
          if (e.config?.headers) {
            delete e.config.headers['Shortcut-Token']
          }
          throw new Error('HTTP error ' + e.response?.status + ' (' + e.response?.statusText + ') ' + JSON.stringify(e.response?.data), {cause: e})
        }
        throw e
      }
    }
  }
  return SearchableMixin
}


export {
  Gettable,
  Listable,
  Searchable,
  ServiceBase,
  ServiceBaseFor,
  type GettableService,
  type ListableService
}
