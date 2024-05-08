import * as console from 'node:console'

import axios, {AxiosResponse} from 'axios'

import BaseResource, {ResourceOperation} from '@sx/base-resource'
import EpicApiData from '@sx/epics/contracts/epic-api-data'
import Epic from '@sx/epics/epic'
import LabelInterface from '@sx/labels/contracts/label-interface'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {getHeaders} from '@sx/utils/headers'


export default class Label extends BaseResource<LabelInterface> implements LabelInterface {
  public static baseUrl: string = 'https://api.app.shortcut.com/api/v3/labels'
  public createFields = ['color', 'description', 'externalId', 'name']
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

  constructor(init: LabelInterface | object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Get all stories using this label
   */
  async stories(): Promise<Story[]> {
    console.log('this.id', this.id)
    const response: AxiosResponse | void = await axios.get(`${Label.baseUrl}/${this.id}/stories`, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, {})
    })
    if (!response) {
      throw new Error('Failed to fetch stories')
    }
    const data: Array<StoryApiData> = response.data
    return data.map(storyData => convertApiFields<StoryApiData, Story>(storyData))
  }

  /**
   * Get all epics using this label
   */
  async epics(): Promise<Epic[]> {
    const response: AxiosResponse | void = await axios.get(`${Label.baseUrl}/${this.id}/epics`, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, {})
    })
    if (!response) return []
    const data: EpicApiData[] = response.data
    return data.map(epicData => convertApiFields<EpicApiData, Epic>(epicData))
  }

  appUrl: string
  archived: boolean
  color: string | null
  createdAt: Date | null
  description: string | null
  entityType: string
  externalId: string | null
  id: number
  name: string
  stats: object[]
  updatedAt: Date | null
}
