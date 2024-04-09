import axios from 'axios'

import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'


/**
 * @inheritDoc
 */
export default class StoriesService extends BaseSearchableService<Story, StoryInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
  protected factory = (data: object) => new Story(data as StoryInterface)
  public availableOperations: ServiceOperation[] = ['get', 'search']

  constructor(init: { headers: Record<string, string> }) {
    super(init)
  }

  /**
   * Fetches all stories that have an external link associated with them.
   */
  async getExternallyLinked(link: string): Promise<Story[]> {
    const url = 'https://api.app.shortcut.com/api/v3/external-link/stories'
    const response = await axios.get(url, { headers: this.headers, params: { external_link: link } })
    return response.data.map((data: StoryApiData) => {
      const interfaceData = convertApiFields(data)
      return this.factory(interfaceData)
    })
  }
}
