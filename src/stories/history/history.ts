import BaseResource from '@sx/base-resource'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import {HistoryActionChangeInterface} from '@sx/stories/history/actions/contracts/history-action-interface'
import HistoryAction from '@sx/stories/history/actions/history-action'
import HistoryInterface from '@sx/stories/history/contracts/history-interface'
import FlatHistory from '@sx/stories/history/flat-history'
import ResourceConverter from '@sx/utils/convert-to-resource'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


class History extends BaseResource<HistoryInterface> implements HistoryInterface {
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
  get member(): Promise<Member | null> {
    const service = new MembersService({headers: getHeaders()})
    return service.get(this.memberId)
  }

  private async flatHistory(newValue: unknown, oldValue: unknown): Promise<FlatHistory> {
    return {newValue: newValue, oldValue: oldValue, member: await this.member, changedAt: this.changedAt, id: this.id} as FlatHistory
  }

  async getWorkflowHistory(): Promise<Array<FlatHistory>> {
    const actions = this.actions
    // TODO: Ensure that this function is working as expected, it appears to be returning an array of arrays not an array of objects
    // @ts-expect-error idk and I'm not in the mood to figure it out
    const changes: Array<{ workflowStateId: HistoryActionChangeInterface}> = actions.map(action => action.changes)
    const converter = new ResourceConverter()

    const convertedChanges: Promise<FlatHistory | null>[] = changes.map(async (obj) => {
      if (obj === undefined || !obj.workflowStateId) return null
      const newValue = obj.workflowStateId.new
      const oldValue = obj.workflowStateId.old
      if (!newValue || !oldValue) return null
      const newResource = await converter.getResourceFromId(newValue, 'workflowStateId')
      const oldResource = await converter.getResourceFromId(oldValue, 'workflowStateId')
      return await this.flatHistory(newResource, oldResource)
    })

    const resolvedChanges = await Promise.all(convertedChanges)
    return resolvedChanges.filter(change => change !== null) as Array<FlatHistory>
  }


  actions: HistoryAction[]
  changedAt: Date
  externalId: string
  id: UUID
  memberId: UUID
  primaryId: number
  references: []
  version: string
  webhookId: string

}

export default History
