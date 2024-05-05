import BaseInterface from '@sx/base-interface'
import ShortcutResource from '@sx/base-resource'
import {BaseSearchableService, BaseService} from '@sx/base-service'
import {SearchResponse} from '@sx/index'


// Mock for ShortcutResource
class MockResource extends ShortcutResource {
  id: string

  constructor(id: string) {
    super()
    this.id = id
  }
}

// Mock for BaseSearchableService
class MockService extends BaseSearchableService<MockResource, BaseInterface> {
}

describe('SearchResponse', () => {
  let mockService: MockService
  let initialResources: MockResource[]
  let searchResponse: SearchResponse<MockResource, BaseInterface>

  beforeEach(() => {
    mockService = new MockService({headers: {}})
    initialResources = [new MockResource('1'), new MockResource('2')]
    searchResponse = new SearchResponse({
      query: 'initialQuery',
      results: initialResources,
      next: 'nextPageToken',
      service: mockService,
    })
  })


  test('should initialize correctly with given parameters', () => {
    expect(searchResponse.results).toEqual(initialResources)
    expect(searchResponse.nextPage).toBe('nextPageToken')
    expect(searchResponse.service).toBe(mockService)
  })

  test('hasNextPage should return true when there is a next page token', () => {
    expect(searchResponse.hasNextPage).toBe(true)
  })

  test('hasNextPage should return false when there is no next page token', () => {
    searchResponse.nextPage = undefined
    expect(searchResponse.hasNextPage).toBe(false)
  })

})
