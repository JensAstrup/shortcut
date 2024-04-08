import HistoryAction from '@sx/stories/history/actions/history-action'
import HistoryActionInterface, {HistoryActionEnum} from '@sx/stories/history/actions/contracts/history-action-interface'
import MembersService from '@sx/members/members-service'
import MemberApiData from '@sx/members/contracts/member-api-data'
import MemberInterface, {MemberState} from '@sx/members/contracts/member'
import UUID from '@sx/utils/uuid'
import LabelsService from '@sx/labels/labels-service'
import LabelInterface from '@sx/labels/contracts/label-interface'
import Member from '@sx/members/member'
import Label from '@sx/labels/label'


describe('History Action', () => {
  it('should return an empty array if ownerIds is not defined', async () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {}
    }
    const historyAction = new HistoryAction(actionData)
    const owners = await historyAction.owners
    expect(owners).toEqual([])
  })

  it('should get owners', async () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {},
      ownerIds: ['1']
    }
    const historyAction = new HistoryAction(actionData)
    const memberInterface = {
      id: '1',
      name: 'test',
      createdAt: new Date('2021-01-01T00:00:00Z'),
      updatedAt: new Date('2021-01-01T00:00:00Z'),
      email: '',
      disabled: false,
      entityType: 'member',
      groupIds: [],
      profile: {
        deactivated: false,
        displayIcon: '',
        emailAddress: '',
        gravatarHash: '',
        id: '1',
        isOwner: false,
        name: 'Name',
        twoFactorAuthEnabled: true
      },
      role: 'member',
      state: MemberState.FULL
    } as object as Member
    jest.spyOn(MembersService.prototype, 'getMany').mockResolvedValue([memberInterface])
    const owners = await historyAction.owners
    expect(owners).toEqual([memberInterface])
  })

  it('should return an empty array if labelIds is not defined', async () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {}
    }
    const historyAction = new HistoryAction(actionData)
    const labels = await historyAction.labels
    expect(labels).toEqual([])
  })

  it('should get labels', async () => {
    const actionData: HistoryActionInterface = {
      id: 1,
      appUrl: 'test.com',
      entityType: 'story',
      action: HistoryActionEnum.CREATE,
      name: 'story',
      storyType: 'story',
      changes: {},
      labelIds: [1]
    }
    const historyAction = new HistoryAction(actionData)
    const labelInterface = {
      id: 1,
      name: 'test',
      color: 'blue',
      createdAt: new Date('2021-01-01T00:00:00Z'),
      updatedAt: new Date('2021-01-01T00:00:00Z'),
      entityType: 'label',
      groupIds: [],
      memberIds: [],
      storyIds: []
    } as object as Label

    jest.spyOn(LabelsService.prototype, 'getMany').mockResolvedValue([labelInterface])
    const labels = await historyAction.labels
    expect(labels).toEqual([labelInterface])
  })
})