import historyAction from '@sx/stories/history/actions/history-action'
import ResourceConverter from '@sx/utils/convert-to-resource'
import WorkflowState from '@sx/workflow-states/workflow-state'
import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import MemberInterface from '@sx/members/contracts/member'
import Member from '@sx/members/member'
import HistoryActionInterface, {HistoryActionChangeInterface, HistoryActionEnum} from '@sx/stories/history/actions/contracts/history-action-interface'
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
      changes: [{someField: {new: 'new', old: 'old'}}]
    }
    const history = new History({
      changedAt: new Date(),
      externalId: '',
      memberId: '',
      primaryId: 1,
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
      changes: [{someField: {new: 'new', old: 'old'}}]
    }
    const history = new History({
      changedAt: new Date(),
      externalId: '',
      memberId: '',
      primaryId: 2,
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
    expect(member?.id).toBe('1')
  })

  let historyInstance: History

  beforeEach(() => {
    const historyChanges = {
      workflowStateId: {new: 'new-id-1', old: 'old-id-1'}
    }
    const historyChanges2 = { workflowStateId: {new: 'new-id-2', old: 'old-id-2'} }
    historyInstance = new History({
      externalId: '', references: [],
      actions: [
        {
          action: HistoryActionEnum.UPDATE,
          changes: historyChanges
        } as object as HistoryAction,
        {
          changes: historyChanges2
        } as object as HistoryAction
      ],
      changedAt: new Date('2022-01-01'),
      id: 'unique-id-123',
      memberId: 'member-id-456',
      primaryId: 101,
      version: '1.0',
      webhookId: 'webhook-id-789'
    })
  })

  test('should return an array of FlatHistory objects with complete data', async () => {
    jest.spyOn(ResourceConverter.prototype, 'getResourceFromId').mockResolvedValueOnce({name: 'State Name'} as object as WorkflowState).mockResolvedValue({name: 'State Name'} as object as WorkflowState)
    const memberData = {id: '1', profile: {name: 'Test Member'}} as MemberInterface
    axiosMock.onGet().reply(200, memberData)

    const workflowHistory = await historyInstance.getWorkflowHistory()

    expect(workflowHistory.length).toBe(2)
    workflowHistory.forEach((history) => {
      expect(history).toHaveProperty('newValue')
      expect(history).toHaveProperty('oldValue')
      expect(history.newValue).toHaveProperty('name', 'State Name')
      expect(history.oldValue).toHaveProperty('name', 'State Name')
      expect(history.member.profile).toHaveProperty('name', 'Test Member')
    })
  })


})
