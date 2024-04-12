import ShortcutResource from '@sx/base-resource'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import HistoryActionInterface from '@sx/stories/history/actions/contracts/history-action-interface'
import HistoryAction from '@sx/stories/history/actions/history-action'
import HistoryInterface from '@sx/stories/history/contracts/history-interface'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


class History extends ShortcutResource<HistoryInterface> implements HistoryInterface {
  constructor(init: HistoryInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
    this.instantiateActions()
  }

  private instantiateActions() {
    this.actions = this.actions?.map(action => new HistoryAction(action))
  }

  /**
   * Get an instance of the member that made the change
   */
  get member(): Promise<Member>{
    const service = new MembersService({headers: getHeaders()})
    return service.get(this.memberId)
  }

  actions: HistoryActionInterface[] | HistoryAction[]
  changedAt: Date
  externalId: string
  id: UUID
  memberId: UUID
  primaryId: undefined
  references: []
  version: string
  webhookId: string

}

export default History
