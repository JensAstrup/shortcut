import BaseInterface from '@sx/base-interface'
import ShortcutResource from '@sx/base-resource'
import {BaseSearchableService} from '@sx/base-service'


class SearchResponse<Resource extends ShortcutResource> {
  public nextPage: undefined | string
  public results: Resource[]

  constructor(init: { next?: string; results: Resource[] }) {
    this.nextPage = init.next
    this.results = init.results
  }

  public hasNextPage(): boolean {
    return this.nextPage !== undefined
  }

  public next(){
    if (!this.hasNextPage()) {
      throw new Error('No next page available')
    }
    const service: BaseSearchableService<ShortcutResource, BaseInterface> = this.results[0].service as BaseSearchableService<ShortcutResource, BaseInterface>
    return service.search(this.nextPage!)
  }
}

export default SearchResponse
