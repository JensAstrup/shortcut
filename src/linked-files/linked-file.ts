import BaseResource, {ResourceOperation} from '@sx/base-resource'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import StoriesService from '@sx/stories/stories-service'
import Story from '@sx/stories/story'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


/**
 * @remarks
 * Related: {@link LinkedFilesService} for the service managing stories.
 *
 * @inheritDoc BaseResource
 */
export default class LinkedFile extends BaseResource<LinkedFileInterface> implements LinkedFileInterface {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/linked-files'
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']
  public createFields = ['contentType', 'description', 'name', 'size', 'storyId', 'type', 'uploaderId', 'url']

  constructor(init: LinkedFileInterface) {
    super(init)
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Gets all stories that have linked this file
   */
  get stories(): Promise<Story[]> {
    const service = new StoriesService({headers: getHeaders()})
    return service.getMany(this.storyIds)
  }

  contentType: string
  createdAt: Date
  description: string
  entityType: string
  groupMentionIds: UUID[]
  id: number
  memberMentionIds: UUID[]
  name: string
  size: number | null
  storyIds: number[]
  thumbnailUrl: string | null
  type: string
  updatedAt: Date
  url: string
}
