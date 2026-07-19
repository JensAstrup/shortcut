import BaseResource, {ResourceOperation} from '@sx/base-resource'
import StoryLinkInterface from '@sx/stories/links/contracts/story-link-interface'


class StoryLink extends BaseResource<StoryLinkInterface> implements StoryLinkInterface {
  public static baseUrl = '/story-links'
  public availableOperations: ResourceOperation[] = ['delete', 'create', 'update']
  public createFields: string[] = ['subjectId', 'verb', 'objectId']

  constructor(init: object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  createdAt: string
  entityType: string
  id: number
  objectId: number
  subjectId: number
  type: string
  updatedAt: string
  verb: 'blocks' | 'duplicates' | 'relates to'
}

export { StoryLink as default }

