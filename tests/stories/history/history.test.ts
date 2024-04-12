import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import MemberInterface from '@sx/members/contracts/member'
import Member from '@sx/members/member'
import HistoryActionInterface, {HistoryActionEnum} from '@sx/stories/history/actions/contracts/history-action-interface'
import HistoryAction from '@sx/stories/history/actions/history-action'
import History from '@sx/stories/history/history'


const axiosMock = new AxiosMockAdapter(axios)

describe('History', () => {
  it('should instantiate actions', () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {}
    }
    const history = new History({
      changedAt: new Date(),
      externalId: '',
      memberId: '',
      primaryId: undefined,
      references: [],
      version: '',
      webhookId: '',
      id: '1',
      actions: [actionData]
    })
    expect(history.actions[0]).toBeInstanceOf(HistoryAction)
  })

  it('should get member', async () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {}
    }
    const history = new History({
      changedAt: new Date(),
      externalId: '',
      memberId: '',
      primaryId: undefined,
      references: [],
      version: '',
      webhookId: '',
      id: '1',
      actions: [actionData]
    })
    const memberData = {id: '1'} as MemberInterface
    axiosMock.onGet().reply(200, memberData)
    const member = await history.member
    expect(member).toBeInstanceOf(Member)
    expect(member.id).toBe('1')
  })
})
