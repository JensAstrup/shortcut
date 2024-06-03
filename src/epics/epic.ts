import axios from 'axios'

import BaseData from '@sx/base-data'
import BaseResource from '@sx/base-resource'
import EpicInterface from '@sx/epics/contracts/epic-interface'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import Objective from '@sx/objectives/objective'
import ObjectivesService from '@sx/objectives/objectives-service'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import CreateThreadedCommentData from '@sx/threaded-comments/contracts/create-threaded-comment-data'
import ThreadedCommentApiData from '@sx/threaded-comments/contracts/threaded-comment-api-data'
import ThreadedCommentInterface from '@sx/threaded-comments/contracts/threaded-comment-interface'
import {convertApiFields, convertToApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


export default class Epic extends BaseResource<EpicInterface> implements EpicInterface {
  public static baseUrl: string = 'https://api.app.shortcut.com/api/v3/epics'
  public createFields: string[] = ['completedAtOverride', 'createdAt', 'deadline', 'description',
    'epicStateId', 'externalId', 'followerIds', 'groupId', 'groupIds', 'labels', 'milestoneId',
    'name', 'objectiveIds', 'ownerIds', 'plannedStartDate', 'requestedById',
    'startedAtOverride', 'state', 'updatedAt']

  constructor(init: EpicInterface | object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Get the objectives associated with the epic
   * @returns {Promise<Objective[]>}
   */
  get objectives(): Promise<Objective[]> {
    const service = new ObjectivesService({headers: getHeaders()})
    return service.getMany(this.objectiveIds)
  }

  /**
   * Get the teams assigned to the story, labelled as "Group" in the Shortcut API
   * @returns {Promise<Team>}
   */
  get teams(): Promise<Team[]> {
    const service = new TeamsService({headers: getHeaders()})
    return service.getMany(this.groupIds)
  }

  /**
   * Get the members following the epic
   * @returns {Promise<Member[]>}
   */
  get followers(): Promise<Member[]> {
    const service: MembersService = new MembersService({headers: getHeaders()})
    return service.getMany(this.followerIds)
  }

  /**
   * Get the owners of the epic
   * @returns {Promise<Member[]>}
   */
  get owners(): Promise<Member[]> {
    const service = new MembersService({headers: getHeaders()})
    return service.getMany(this.ownerIds)
  }

  /**
   * Add a comment to the epic authored by the user associated with the API key currently in use
   *
   * @example
   * ```typescript
   * const epic = new Epic({id: 123})
   * epic.comment('This is a comment').then((comment) => {
   *    console.log(comment)
   * })
   * ```
   * @param comment
   */
  public async comment(comment: string): Promise<ThreadedCommentInterface | void> {
    const url = `${Epic.baseUrl}/${this.id}/comments`
    const response = await axios.post(url, {text: comment}, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, {text: comment})
    })
    if (!response) {
      throw new Error('Failed to add comment')
    }
    const data: ThreadedCommentApiData = response.data
    return convertApiFields(data) as ThreadedCommentInterface
  }

  /**
   * Add a comment to the epic using the provided comment data. If you're just looking to add a comment from the authorized user, use the `comment` method.
   *
   * @param comment
   * @returns {Promise<ThreadedCommentInterface | void>}
   * {@link Epic.comment}
   *
   * {@link CreateThreadedCommentData}
   */
  public async addComment(comment: CreateThreadedCommentData): Promise<ThreadedCommentInterface | void> {
    const url = `${Epic.baseUrl}/${this.id}/comments`
    const requestData: BaseData = convertToApiFields(comment)
    const response = await axios.post(url, requestData, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, requestData)
    })
    if (!response){
      throw new Error('Failed to add comment')
    }
    const data: ThreadedCommentApiData = response.data
    return convertApiFields(data) as ThreadedCommentInterface
  }



  appUrl: string
  archived: boolean
  associatedGroups: []
  completed: boolean
  completedAt: string | null
  completedAtOverride: string | null
  deadline: string | null
  description: string
  entityType: string
  epicStateId: number
  externalId: string | null
  followerIds: UUID[]
  groupIds: UUID[]
  id: number
  labelIds: number[]
  labels: []
  memberMentionIds: UUID[]
  mentionIds: UUID[]
  milestoneId: number | null
  name: string
  objectiveIds: number[]
  ownerIds: UUID[]
  plannedStartDate: string | null
  position: number
  productboardId: UUID | null
  productboardName: string | null
  productboardPluginId: UUID | null
  productboardUrl: string | null
  projectIds: number[]
  requestedById: UUID
  started: boolean
  startedAt: string | null
  startedAtOverride: string | null
  stats: object
  storiesWithoutProjects: number
  updatedAt: string | null
}
