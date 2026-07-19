import { AxiosError, AxiosInstance, AxiosResponse } from 'axios'

import BaseData from '@sx/base-data'
import BaseInterface from '@sx/base-interface'
import BaseResource from '@sx/base-resource'
import { convertApiFields } from '@sx/utils/convert-fields'
import { ShortcutApiFieldType } from '@sx/utils/field-type'
import { normalizeNext } from '@sx/utils/http'
import SearchResponse from '@sx/utils/search-response'
import UUID from '@sx/utils/uuid'


type ServiceOperation = 'get' | 'search' | 'list'


class BaseService<Resource extends BaseResource, Interface extends BaseInterface> {
  /** The path of the resource, relative to the base URL configured on {@link http}. */
  public baseUrl = ''
  /** The pre-authenticated HTTP client shared with the {@link Client} that created this service. */
  public readonly http: AxiosInstance
  protected factory: (data: Interface) => Resource
  protected instances: Record<string, Resource> = {}
  /** Lists out the available operations for the resource, calling methods not in this list will result in an error */
  public availableOperations: ServiceOperation[] = []

  /**
   * Service classes are not intended to be instantiated directly. Instead, use the {@link Client} class to create instances of services.
   */
  constructor(init: { http: AxiosInstance }) {
    this.http = init.http
  }

  /**
   * Build a resource from interface data, handing it the HTTP client so that any requests it makes
   * are authenticated as the same client that fetched it.
   */
  protected build(data: Interface): Resource {
    return this.factory(data).setHttp(this.http) as Resource
  }

  public async get(id: string | number): Promise<Resource> {
    if (!this.availableOperations.includes('get')) {
      throw new Error('Operation not supported')
    }
    if (id in this.instances) {
      return this.instances[id]
    }
    const url = `${this.baseUrl}/${id}`
    const response = await this.http.get(url)
    const HTTP_ERROR = 400
    if (response.status >= HTTP_ERROR) {
      throw new Error('HTTP error ' + response.status)
    }
    const instanceData: Interface = convertApiFields<BaseData, Interface>(response.data)
    const instance: Resource = this.build(instanceData)
    this.instances[id] = instance
    return instance
  }

  public async getMany(ids: UUID[] | number[]): Promise<Resource[]> {
    return Promise.all(ids.map(id => this.get(id)))
  }

  public async list(): Promise<Resource[]> {
    if (!this.availableOperations.includes('list')) {
      throw new Error('Operation not supported')
    }
    const response: AxiosResponse = await this.http.get(this.baseUrl)
    const HTTP_ERROR = 400
    if (response.status >= HTTP_ERROR) {
      throw new Error('HTTP error ' + response.status)
    }
    const instancesData: Record<string, ShortcutApiFieldType>[] = response.data ?? []
    const resources: Resource[] = instancesData.map(instance => this.build(convertApiFields(instance)))
    this.instances = resources.reduce((acc: Record<string, Resource>, resource: Resource) => {
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

interface SearchApiResponse {
    query: string
    next: string
    data?: BaseData[]
}

class BaseSearchableService<Resource extends BaseResource, Interface extends BaseInterface> extends BaseService<Resource, Interface> {
  public availableOperations: ServiceOperation[] = ['search']


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
  public async search(query: string, next?: string): Promise<SearchResponse<Resource, Interface>> {
    const pathSegments = this.baseUrl.split('/')
    const resource = pathSegments.pop()
    // `next` is returned by the API as a path that already includes the version prefix, so it is
    // normalized rather than appended to the client's base URL.
    const url = next
      ? normalizeNext(next)
      : `/search/${resource}?${new URLSearchParams({ query: query }).toString()}`

    try {
      const response = await this.http.get(url)

      const HTTP_ERROR = 400
      if (response.status >= HTTP_ERROR) {
        throw new Error('HTTP error ' + response.status + ' (' + response.statusText + ') ' + JSON.stringify(response.data))
      }
      const responseData = response.data as SearchApiResponse
      const nextPage = responseData.next
      const resourceData: BaseData[] = responseData.data ?? []
      return new SearchResponse<Resource, Interface>({
        query: query,
        next: nextPage,
        results: resourceData.map(resource => this.build(convertApiFields<BaseData, Interface>(resource))),
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

export default BaseService
export { BaseSearchableService, BaseService, ServiceOperation }
