import {AxiosInstance} from 'axios'

import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'


/**
 * @inheritDoc
 */
class StoriesService extends BaseSearchableService<Story, StoryInterface> {
  public baseUrl = '/stories'
  protected factory = (data: object): Story => new Story(data)
  public availableOperations: ServiceOperation[] = ['get', 'search']

  constructor(init: { http: AxiosInstance }) {
    super(init)
  }

  /**
   * Fetches all stories that have an external link associated with them.
   */
  async getExternallyLinked(link: string): Promise<Story[]> {
    const url = '/external-link/stories'
    const response = await this.http.get(url, { params: { external_link: link } }).catch((error) => {
      handleResponseFailure(error, { external_link: link })
    })
    if (!response) {
      throw new Error('Failed to fetch externally linked stories')
    }
    return response.data.map((data: StoryApiData) => {
      const interfaceData = convertApiFields(data) as StoryInterface
      return this.build(interfaceData)
    })
  }
}

export { StoriesService as default }

