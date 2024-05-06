import BaseInterface from '@sx/base-interface'
import ShortcutResource from '@sx/base-resource'
import {BaseSearchableService} from '@sx/base-service'
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

  test('hasNextPage should return false when next page token is null', () => {
    searchResponse.nextPage = null
    expect(searchResponse.hasNextPage).toBe(false)
  })

  test('next should throw an error when there is no next page token', () => {
    searchResponse.nextPage = undefined
    expect(() => searchResponse.next()).toThrow('No next page available')
  })

  test('next should return a new SearchResponse when there is a next page token', () => {
    const newResources = [new MockResource('3'), new MockResource('4')]
    const newSearchResponse = new SearchResponse({
      query: 'newQuery',
      results: newResources,
      next: 'newPageToken',
      service: mockService,
    })
    mockService.search = jest.fn().mockResolvedValue(newSearchResponse)
    searchResponse.next().then((response) => {
      expect(response).toEqual(newSearchResponse)
    })
    expect(mockService.search).toHaveBeenCalledWith('initialQuery', 'nextPageToken')
  })

})
