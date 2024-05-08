import BaseInterface from '@sx/base-interface'
import BaseResource from '@sx/base-resource'
import {BaseSearchableService} from '@sx/base-service'


class SearchResponse<Resource extends BaseResource, Interface extends BaseInterface> {
  public query: string
  public nextPage: undefined | string | null
  public results: Resource[]
  public service: BaseSearchableService<Resource, Interface>

  constructor(init: {query: string, results: Resource[], next?: string, service: BaseSearchableService<Resource, Interface> }) {
    this.query = init.query
    this.nextPage = init.next
    this.results = init.results
    this.service = init.service
  }

  get hasNextPage(): boolean {
    return this.nextPage !== undefined && this.nextPage !== null
  }

  public next(){
    if (!this.hasNextPage) {
      throw new Error('No next page available')
    }
    return this.service.search(this.query, this.nextPage!)
  }
}

export default SearchResponse
