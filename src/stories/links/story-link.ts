import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import StoryLinkInterface from '@sx/stories/links/contracts/story-link-interface'


export default class StoryLink extends ShortcutResource<StoryLinkInterface> implements StoryLinkInterface {
  public static baseUrl = 'https://api.app.shortcut.com/api/v3/story-links'
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
