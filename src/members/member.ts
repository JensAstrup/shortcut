import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import MemberInterface, {MemberProfile, MemberState} from '@sx/members/contracts/member'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import {getHeaders} from '@sx/utils/headers'


/**
 * @inheritDoc
 */
export default class Member extends ShortcutResource<MemberInterface> implements MemberInterface {
  public static baseUrl = 'https://api.app.shortcut.com/api/v3/members'
  public availableOperations: ResourceOperation[] = []

  createdAt: string
  disabled: boolean
  entityType: string
  groupIds: string[]
  id: string
  name: string
  profile: MemberProfile
  role: string
  state: MemberState
  updatedAt: string

  public baseUrl = 'https://api.app.shortcut.com/api/v3/members'

  constructor(init: StoryInterface | object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  get teams(): Promise<Team[]> {
    const service = new TeamsService({headers: getHeaders()})
    return service.getMany(this.groupIds)
  }
}
