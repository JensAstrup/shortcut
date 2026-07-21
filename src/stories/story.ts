import {AxiosInstance} from 'axios'

import BaseResource, {ResourceOperation} from '@sx/base-resource'
import Epic from '@sx/epics/epic'
import EpicsService from '@sx/epics/epics-service'
import Iteration from '@sx/iterations/iteration'
import IterationsService from '@sx/iterations/iterations-service'
import Label from '@sx/labels/label'
import Member from '@sx/members/member'
import MembersService from '@sx/members/members-service'
import {PullRequestInterface} from '@sx/pull-requests/contracts/pull-request-interface'
import StoryCommentApiData from '@sx/stories/comment/contracts/story-comment-api-data'
import {StoryCommentInterface} from '@sx/stories/comment/contracts/story-comment-interface'
import StoryComment from '@sx/stories/comment/story-comment'
import StoryInterface from '@sx/stories/contracts/story-interface'
import StoryCustomFieldInterface from '@sx/stories/custom-fields/contracts/story-custom-field-interface'
import StoryCustomField from '@sx/stories/custom-fields/story-custom-field'
import HistoryApiData from '@sx/stories/history/contracts/history-api-data'
import HistoryInterface from '@sx/stories/history/contracts/history-interface'
import FlatHistory from '@sx/stories/history/flat-history'
import History from '@sx/stories/history/history'
import StoryLinkInterface from '@sx/stories/links/contracts/story-link-interface'
import StoryLink from '@sx/stories/links/story-link'
import TaskApiData from '@sx/stories/tasks/contracts/task-api-data'
import TaskInterface from '@sx/stories/tasks/contracts/task-interface'
import Task from '@sx/stories/tasks/task'
import Team from '@sx/teams/team'
import TeamsService from '@sx/teams/teams-service'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import UploadedFilesService from '@sx/uploaded-files/uploaded-files-service'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'
import WorkflowStateInterface, {WorkflowStateType} from '@sx/workflow-states/contracts/workflow-state-interface'
import WorkflowService from '@sx/workflows/workflows-service'


/**
 * @remarks
 * Related: {@link StoriesService} for the service managing stories.
 *
 * @story
 * @inheritDoc BaseResource
 */
class Story extends BaseResource<StoryInterface> implements StoryInterface {
  public static baseUrl: string = '/stories'
  /**
   * `labels` is deliberately absent: it is an accessor backed by the `_labels` instance field, so it
   * never appears in `Object.keys(this)` and listing it would have no effect. Set labels with
   * `update()` after the story exists.
   */
  public createFields: string[] = [
    'name', 'description', 'storyType', 'workflowStateId', 'epicId', 'estimate', 'groupId',
    'iterationId', 'ownerIds', 'followerIds', 'requestedById', 'deadline', 'externalId',
    'externalLinks', 'projectId', 'archived'
  ]
  public availableOperations: ResourceOperation[] = ['create', 'update', 'delete', 'comment']

  // These properties are utilized internally by the class and should not be accessed directly
  private _labels: Label[] = []

  constructor(init: StoryInterface | object) {
    super()
    Object.assign(this, init)
    this.instantiateComments()
    this.instantiateTasks()
    this.instantiateLinks()
    this.instantiateCustomFields()
    this.instantiateLabels()
    this.changedFields = []
  }

  /**
   * @internal
   * Child resources are built in the constructor, before a client is attached, so the client has to
   * be handed down to them here rather than at construction time.
   */
  public setHttp(http: AxiosInstance): this {
    super.setHttp(http)
    this.comments?.forEach((comment: StoryComment) => comment.setHttp(http))
    this.tasks?.forEach((task: Task) => task.setHttp(http))
    this.storyLinks?.forEach((link: StoryLink) => link.setHttp(http))
    this.customFields?.forEach((field: StoryCustomField) => field.setHttp(http))
    this.labels?.forEach((label: Label) => label.setHttp(http))
    return this
  }

  protected async _preSave(): Promise<void> {
    if (this.changedFields.includes('labels')) {
      this.labels = this.labels.map((label) => {
        return {name: label.name} as Label
      })
    }
    return super._preSave()
  }

  private instantiateComments(): void {
    this.comments = this.comments?.map((comment: StoryCommentInterface | StoryComment) => new StoryComment(comment))
  }

  private instantiateTasks(): void {
    this.tasks = this.tasks?.map((task: TaskInterface | Task) => new Task(task))
  }

  private instantiateLinks(): void {
    this.storyLinks = this.storyLinks?.map((link: StoryLinkInterface | StoryLink) => new StoryLink(link))
  }

  private instantiateCustomFields(): void {
    this.customFields = this.customFields?.map((field: StoryCustomFieldInterface | StoryCustomField) => field instanceof StoryCustomField ? field : new StoryCustomField(field))
  }

  private instantiateLabels(): void {
    this.labels = this.labels?.map((label) => new Label(label))
  }

  /**
   * Set the labels associated with the story. In order for creating/updating of stories to work properly with labels, you must set the labels to
   * a new array of labels, rather than modifying the existing array. This allows the {@link Story} class to track changes to the labels.
   */
  set labels(labels: Label[]) {
    this.changedFields.push('labels')
    this._labels = labels
  }

  get labels(): Label[] {
    return this._labels
  }

  get workflow(): Promise<WorkflowStateInterface> {
    const service = new WorkflowService({http: this.http})
    return service.getWorkflowState(this.workflowStateId)
  }

  /**
   * Get the state of the story, i.e. Finished, Started, Unstarted
   */
  async state(): Promise<WorkflowStateType> {
    const workflow = await this.workflow
    return workflow.type
  }

  get iteration(): Promise<Iteration> | null {
    if (this.iterationId === null) {
      return null
    }
    const iterationService = new IterationsService({http: this.http})
    return iterationService.get(this.iterationId)
  }

  /**
   * Get the team assigned to the story, labelled as "Group" in the Shortcut API
   * @returns {Promise<Team>}
   */
  get team(): Promise<Team> | null {
    if (this.groupId === null) {
      return null
    }
    const service = new TeamsService({http: this.http})
    return service.get(this.groupId)
  }

  /**
   * Get the owners of the story
   * @returns {Promise<Member[]>}
   */
  get owners(): Promise<Member[]> {
    const service = new MembersService({http: this.http})
    return service.getMany(this.ownerIds)
  }

  /**
   * Get the epic of the story
   * @returns {Promise<Epic>}
   */
  get epic(): Promise<Epic> | null {
    if (this.epicId === null) {
      return null
    }
    const service = new EpicsService({http: this.http})
    return service.get(this.epicId)
  }

  public async history(): Promise<History[]> {
    const url = `${Story.baseUrl}/${this.id}/history`
    const response = await this.http.get(url).catch((error) => {
      handleResponseFailure(error, {storyId: this.id})
      throw new Error(`Error fetching history: ${error}`)
    })
    const historyData: HistoryApiData[] = response.data
    return historyData.map((history) => {
      const historyInterface = convertApiFields<HistoryApiData, HistoryInterface>(history)
      return new History(historyInterface).setHttp(this.http)
    })
  }

  /**
   * Get the history of workflow changes for the story as a flat array. See {@link FlatHistory} for the structure of the flat history.
   * This is useful for making calculations or determining when specific events occurred as it reduces the complexity of the history data.
   * Note however that there is additional network overhead in fetching the history data. There is an initial request to fetch all workflow history,
   * and each subsequent {@link Member} is fetched individually.
   */
  public async workflowHistory(): Promise<FlatHistory[]> {
    const history = await this.history()
    const flatHistories = await Promise.all(history.map(async (history) => {
      return await history.getWorkflowHistory()
    }))
    return flatHistories.flat()
  }

  /**
   * Calculates the cycle time of a story in hours.
   *
   * @returns {number} - The cycle time in hours.
   * @throws {Error} - If the story is not completed or has not been started.
   */
  public cycleTime(): number {
    const startedAt: Date | null = this.startedAt
    const completedAt: Date | null = this.completedAt

    if (!startedAt || !completedAt) {
      throw new Error('Story does not have a cycle time')
    }

    // eslint-disable-next-line no-magic-numbers
    const millisecondsToHour = 1000 * 60 * 60
    return (completedAt.getTime() - startedAt.getTime()) / millisecondsToHour
  }

  /**
   * Calculates the time a story has been in development in hours.
   *
   * @returns {Promise<number>} - The time in development in hours.
   * @throws {Error} - If the story is already finished or not started.
   */
  public async timeInDevelopment(): Promise<number> {
    const workflow: WorkflowStateInterface = await this.workflow
    if (workflow.type === WorkflowStateType.FINISHED) {
      throw new Error('Story is already finished')
    }
    if (!this.startedAt) {
      throw new Error('Story is not started')
    }
    // eslint-disable-next-line no-magic-numbers
    const millisecondsToHour = 1000 * 60 * 60
    return (new Date().getTime() - this.startedAt.getTime()) / millisecondsToHour
  }

  public async comment(comment: string): Promise<StoryComment> {
    const url = `${Story.baseUrl}/${this.id}/comments`
    const response = await this.http.post(url, {text: comment}).catch((error) => {
      handleResponseFailure(error, {storyId: this.id})
      throw new Error(`Error creating comment: ${error}`)
    })
    const data: StoryCommentApiData = response.data
    const interfaceData = convertApiFields(data)

    return new StoryComment(interfaceData).setHttp(this.http)
  }

  public async addFile(file: Buffer): Promise<UploadedFile> {
    const service = new UploadedFilesService({http: this.http})
    return service.upload(file, this)
  }

  /**
   * Adds a subtask to the story, these are visible in Shortcut as a to-do list of items that need to be completed.
   * @param task
   */
  public async addTask(task: string): Promise<void> {
    const url = `${Story.baseUrl}/${this.id}/tasks`
    const requestData = {description: task}
    const response = await this.http.post(url, requestData).catch((error) => {
      handleResponseFailure(error, {storyId: this.id})
      throw new Error(`Error adding task: ${error}`)
    })
    const data: TaskApiData = response.data
    const interfaceData = convertApiFields(data)
    const createdTask = new Task(interfaceData).setHttp(this.http)
    this.tasks.push(createdTask)
  }

  /**
   * Provide a story or story ID to indicate that this work blocks another story from being ready to start.
   * @param story
   */
  public async blocks(story: Story | number): Promise<void> {
    const link: StoryLink = new StoryLink({
      objectId: this.id,
      verb: 'blocks',
      subjectId: story instanceof Story ? story.id : story
    }).setHttp(this.http)
    await link.save()
    this.storyLinks.push(link)
  }

  /**
   * Provide a story or story ID to indicate that this story is duplicative of another story.
   * @param story
   */
  public async duplicates(story: Story | number): Promise<void> {
    const link: StoryLink = new StoryLink({
      objectId: this.id,
      verb: 'duplicates',
      subjectId: story instanceof Story ? story.id : story
    }).setHttp(this.http)
    await link.save()
    this.storyLinks.push(link)
  }

  /**
   * Provide a story or story ID to indicate that this story is related to another story.
   * @param story
   */
  public async relatesTo(story: Story | number): Promise<void> {
    const link: StoryLink = new StoryLink({
      objectId: this.id,
      verb: 'relates to',
      subjectId: story instanceof Story ? story.id : story
    }).setHttp(this.http)
    await link.save()
    this.storyLinks.push(link)
  }


  appUrl: string
  archived: boolean
  blocked: boolean
  blocker: boolean
  branches: object[]
  comments: StoryComment[]
  commits: object[]
  completed: boolean
  completedAt: Date | null
  completedAtOverride: Date | null
  createdAt: Date
  customFields: StoryCustomField[]
  deadline: Date | null
  description: string
  entityType: string
  epicId: number | null
  estimate: number | null
  externalId: string | null
  externalLinks: string[]
  files: object[]
  followerIds: string[]
  groupId: string | null
  groupMentionIds: string[]
  id: number
  iterationId: number | null
  labelIds: number[]
  /* The lead time in seconds of this story */
  leadTime: number
  linkedFiles: object[]
  memberMentionIds: string[]
  mentionIds: string[]
  movedAt: Date | null
  name: string
  ownerIds: string[]
  position: number
  previousIterationIds: number[]
  projectId: number | null
  requestedById: string
  started: boolean
  startedAt: Date | null
  startedAtOverride: Date | null
  stats: object
  storyLinks: StoryLink[]
  storyTemplateId: string | null
  storyType: string
  syncedItem: object
  tasks: Task[]
  unresolvedBlockerComments: number[]
  updatedAt: Date | null
  workflowId: number
  workflowStateId: number
  pullRequests: PullRequestInterface[]
}

export default Story
