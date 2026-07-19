import BaseResource, {ResourceOperation} from '@sx/base-resource'
import UUID from '@sx/utils/uuid'


class Task extends BaseResource {
  public baseUrl = '/stories/'
  public availableOperations: ResourceOperation[] = ['update', 'delete']
  public createFields = ['complete', 'createdAt', 'description', 'externalId', 'ownerIds', 'updatedAt']

  constructor(init: object) {
    super()
    Object.assign(this, init)
    // Set before resetting changedFields: assigning it afterwards left 'baseUrl' permanently marked
    // as changed, so every update() sent a spurious base_url field in the request body.
    this.baseUrl = `/stories/${this.storyId}/tasks`
    this.changedFields = []
  }

  complete: boolean
  completedAt: Date | null
  createdAt: Date
  description: string
  entityType: string
  externalId: string | null
  groupMemberId: UUID[]
  id: number
  memberMentionIds: UUID[]
  ownerIds: UUID[]
  position: number
  storyId: number
  updatedAt: Date
}

export { Task as default }

