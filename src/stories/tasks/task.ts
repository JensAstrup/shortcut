import {Deletable, ResourceBaseFor, Updatable} from '@sx/base-resource'
import TaskInterface from '@sx/stories/tasks/contracts/task-interface'
import UUID from '@sx/utils/uuid'


class Task extends Deletable(Updatable(ResourceBaseFor<TaskInterface>())) implements TaskInterface {
  public baseUrl = '/stories/'

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

