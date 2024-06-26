import axios, {AxiosError} from 'axios'

import BaseResource, {ResourceOperation} from '@sx/base-resource'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Story from '@sx/stories/story'
import TeamInterface from '@sx/teams/contracts/team-interface'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {getHeaders} from '@sx/utils/headers'


/**
 * @inheritDoc
 */
class Team extends BaseResource<TeamInterface> implements TeamInterface {
  public static baseUrl = 'https://api.app.shortcut.com/api/v3/groups' // Shortcut renamed groups to teams
  public createFields: string[] = ['name', 'mentionName']
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

  constructor(init: TeamInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  get members(): Promise<Member[]>{
    const service = new MembersService({headers: getHeaders()})
    return service.getMany(this.memberIds)
  }

  get stories() {
    return this.getStories()
  }

  public async getStories(): Promise<Story[]> {
    const url = new URL(`${Team.baseUrl}/${this.id}/stories`)
    const response = await axios.get(url.toString(), {headers: getHeaders()}).catch((error: AxiosError) => {
      handleResponseFailure(error, {url})
    })
    if (!response) {
      throw new Error('Failed to fetch stories')
    }
    const storiesData: StoryApiData[] = response.data.data ?? []
    return storiesData.map((story) => new Story(convertApiFields<StoryApiData, StoryInterface>(story)))
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
