import axios from 'axios'

import BaseData from '@sx/base-data'
import BaseInterface from '@sx/base-interface'
import ShortcutResource from '@sx/base-resource'
import {convertApiFields} from '@sx/utils/convert-fields'
import {ShortcutApiFieldType} from '@sx/utils/field-type'
import UUID from '@sx/utils/uuid'
import * as console from 'node:console'


type ServiceOperation = 'get' | 'search' | 'list'


class BaseService<Resource extends ShortcutResource, Interface extends BaseInterface> {
  public baseUrl = ''
  public headers: Record<string, string>
  protected factory: (data: Interface) => Resource
  protected instances: Record<string, Resource> = {}
  /** Lists out the available operations for the resource, calling methods not in this list will result in an error */
  public availableOperations: ServiceOperation[] = []

  /**
   * Service classes are not intended to be instantiated directly. Instead, use the {@link Client} class to create instances of services.
   */
  constructor(init: { headers: Record<string, string> }) {
    this.headers = init.headers
  }

  public async get(id: string | number): Promise<Resource> {
    if (!this.availableOperations.includes('get')) {
      throw new Error('Operation not supported')
    }
    if (this.instances[id]) {
      return this.instances[id]
    }
    const url = `${this.baseUrl}/${id}`
    const response = await axios.get(url, {headers: this.headers})
    if (response.status >= 400) {
      throw new Error('HTTP error ' + response.status)
    }
    const instanceData: Interface = convertApiFields<BaseData, Interface>(response.data)
    const instance: Resource = this.factory(instanceData)
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
    const response = await axios.get(this.baseUrl, {headers: this.headers})
    if (response.status >= 400) {
      throw new Error('HTTP error ' + response.status)
    }
    const instancesData: Record<string, ShortcutApiFieldType>[] = response.data ?? []
    console.log(instancesData)
    const resources: Resource[] = instancesData.map((instance) => this.factory(convertApiFields(instance)))
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


interface SearchResponse<Resource extends ShortcutResource> {
  next?: string
  results: Resource[]
}

class BaseSearchableService<Resource extends ShortcutResource, Interface extends BaseInterface> extends BaseService<Resource, Interface> {
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
  public async search(query: string, next?: string): Promise<SearchResponse<Resource>>{
    const pathSegments = this.baseUrl.split('/')
    const resource = pathSegments.pop()
    let url = new URL(`https://api.app.shortcut.com/api/v3/search/${resource}`)
    if (next) {
      url = new URL(`https://api.app.shortcut.com${next}`)
    }
    else {
      url.search = new URLSearchParams({query: query}).toString()
    }

    const response = await axios.get(url.toString(), {headers: this.headers})

    if (response.status >= 400) {
      throw new Error('HTTP error ' + response.status)

    }
    const nextPage = response.data.next
    const resourceData: BaseData[] = response.data.data ?? []
    console.log(resourceData)
    return {
      results: resourceData.map((resource) => this.factory(convertApiFields<BaseData, Interface>(resource))),
      next: nextPage
    }
  }
}

export default BaseService
export {BaseSearchableService, BaseService, SearchResponse, ServiceOperation}
