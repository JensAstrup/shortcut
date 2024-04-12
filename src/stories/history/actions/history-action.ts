import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import Label from '@sx/labels/label'
import LabelsService from '@sx/labels/labels-service'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import HistoryActionInterface, {HistoryActionEnum} from '@sx/stories/history/actions/contracts/history-action-interface'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


class HistoryAction extends ShortcutResource<HistoryActionInterface> implements HistoryActionInterface {
  public availableOperations: ResourceOperation[] = []

  constructor(init: HistoryActionInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Get the owners associated with the historical action. Not all actions have owners, in which case an empty array is returned.
   */
  get owners(): Promise<Member[]> {
    if (!this.ownerIds) {
      return Promise.resolve([])
    }
    else {
      const service = new MembersService({headers: getHeaders()})
      return service.getMany(this.ownerIds)
    }
  }

  /**
   * Get the labels associated with the historical action. Not all actions have labels, in which case an empty array is returned.
   */
  get labels(): Promise<Label[]> {
    if (!this.labelIds) {
      return Promise.resolve([])
    }
    const service = new LabelsService({headers: getHeaders()})
    return service.getMany(this.labelIds)
  }

  action: HistoryActionEnum
  appUrl: string
  changes: Record<string, string | number | boolean>
  entityType: string
  id: number
  name: string
  ownerIds: UUID[]
  storyType: string
  labelIds?: number[]
}

export default HistoryAction
