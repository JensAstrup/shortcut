import BaseResource, {ResourceOperation} from '@sx/base-resource'
import MemberInterface, {MemberState} from '@sx/members/contracts/member-interface'
import {MemberProfile} from '@sx/members/contracts/member-profile'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import {getHeaders} from '@sx/utils/headers'


/**
 * @inheritDoc
 */
class Member extends BaseResource<MemberInterface> implements MemberInterface {
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

  get teams(): Promise<Array<Team>> {
    const service = new TeamsService({headers: getHeaders()})
    return service.getMany(this.groupIds)
  }
}

export default Member
