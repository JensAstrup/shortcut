import ShortcutResource from '@sx/base-resource'
import HistoryActionInterface from '@sx/stories/history/actions/contracts/history-action-interface'
import HistoryAction from '@sx/stories/history/actions/history-action'
import HistoryInterface from '@sx/stories/history/contracts/history-interface'
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