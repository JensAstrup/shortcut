import axios from 'axios'

import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import LabelInterface from '@sx/labels/contracts/label-interface'
import {StoryApiData} from '@sx/stories/contracts/story-api-data'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import {getHeaders} from '@sx/utils/headers'


export default class Label extends ShortcutResource<LabelInterface> implements LabelInterface {
  public static baseUrl: string = 'https://api.app.shortcut.com/api/v3/labels'
  public createFields = ['color', 'description', 'externalId', 'name']
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']

  constructor(init: LabelInterface | object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  async stories(): Promise<Story[]>{
    const response = await axios.get(`${Label.baseUrl}/${this.id}/stories`,
      {headers: getHeaders()})
    const data = response.data as StoryApiData[]
    return data.map(storyData => convertApiFields<StoryApiData, Story>(storyData))
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
