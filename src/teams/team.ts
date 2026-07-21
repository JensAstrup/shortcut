import {AxiosError} from 'axios'

import BaseResource, {ResourceOperation} from '@sx/base-resource'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Story from '@sx/stories/story'
import TeamInterface from '@sx/teams/contracts/team-interface'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'


/**
 * @inheritDoc
 */
class Team extends BaseResource<TeamInterface> implements TeamInterface {
  public static baseUrl = '/groups' // Shortcut renamed groups to teams
  public createFields: string[] = ['name', 'mentionName']
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

  constructor(init: TeamInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  get members(): Promise<Member[]>{
    const service = new MembersService({http: this.http})
    return service.getMany(this.memberIds)
  }

  get stories(): Promise<Story[]> {
    return this.getStories()
  }

  public async getStories(): Promise<Story[]> {
    // A relative path, resolved against the client's base URL — not a `new URL(...)`, which requires
    // an absolute URL and would throw here.
    const url = `${Team.baseUrl}/${this.id}/stories`
    const response = await this.http.get(url).catch((error: AxiosError) => {
      handleResponseFailure(error, {url})
    })
    if (!response) {
      throw new Error('Failed to fetch stories')
    }
    const storiesData: StoryApiData[] = response.data.data ?? []
    return storiesData.map((story) => new Story(convertApiFields<StoryApiData, StoryInterface>(story)).setHttp(this.http))
  }

  appUrl: string
  archived: boolean
  color: string
  colorKey: string
  description: string
  displayIcon: string
  entityType : string
  id: string
  memberIds: number[]
  mentionName: string
  name: string
  numEpicsStarted: number
  numStoriesStarted: number
  workflowIds: number[]
}

export default Team
