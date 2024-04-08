import HistoryActionInterface, {HistoryActionEnum} from '@sx/stories/history/actions/contracts/history-action-interface'
import HistoryAction from '@sx/stories/history/actions/history-action'
import History from '@sx/stories/history/history'


describe('History', () => {
  it('should instantiate actions', () => {
    const actionData: HistoryActionInterface = {id: 1, appUrl: 'test.com', entityType: 'story', action: HistoryActionEnum.CREATE, name: 'story', storyType: 'story', changes: {}}
    const history = new History({
      changedAt: new Date(),
      externalId: '',
      memberId: '',
      primaryId: undefined,
      references: [],
      version: '',
      webhookId: '',
      id: '1',
      actions: [actionData]})
    expect(history.actions[0]).toBeInstanceOf(HistoryAction)
  })
})