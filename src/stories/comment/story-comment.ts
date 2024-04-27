import axios from 'axios'

import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import StoryCommentApiData from '@sx/stories/comment/contracts/story-comment-api-data'
import {StoryCommentInterface} from '@sx/stories/comment/contracts/story-comment-interface'
import Story from '@sx/stories/story'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'


export default class StoryComment extends ShortcutResource<StoryCommentInterface> implements StoryCommentInterface {
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete', 'comment']

  constructor(init: object) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }

  /**
   * Add an emoji reaction to a comment
   * @param emoji - The emoji to react with in the format `:emoji:`
   *
   * @example
   * ```typescript
   * const comment = new StoryComment({id: 123, storyId: 456})
   * await comment.react(':thumbsup::skin-tone-4:')
   * ```
   */
  public async react(emoji: string): Promise<void> {
    const url: string = `${Story.baseUrl}/${this.storyId}/comments/${this.id}/reactions`
    await axios.post(url, {emoji}, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, {emoji})
      throw new Error(`Error reacting to comment: ${error}`)
    })
  }

  /**
   * Add a comment to a story as a threaded response to this comment
   * @param comment - The text of the comment
   *
   * @example
   * ```typescript
   * const story = new Story({id: 123})
   * const comment = story.comments[0]
   * await comment.comment('This is a reply to the comment')
   * ```
   */
  public async comment(comment: string): Promise<StoryComment | void> {
    const url = `${Story.baseUrl}/${this.storyId}/comments`
    const requestData: Record<string, string | number> = {text: comment, parentId: this.id}
    const response = await axios.post(url, requestData, {headers: getHeaders()}).catch((error) => {
      handleResponseFailure(error, requestData)
      throw new Error(`Error creating comment: ${error}`)
    })
    const data: StoryCommentApiData = response.data
    return convertApiFields(data) as StoryComment
  }

  authorId: string
  createdAt: Date
  deleted: boolean
  id: number
  memberMentionIds: string[]
  parentId: number | null
  story?: Story | null
  storyId: number
  text: string | null
  updatedAt: Date
  appUrl: string
  blocker: boolean
  entityType: string
  externalId: string | null
  groupMentionIds: UUID[]
  position: number
  unblocksParent: boolean
}
