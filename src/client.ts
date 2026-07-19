import {AxiosInstance} from 'axios'

import CustomFieldsService from '@sx/custom-fields/custom-fields-service'
import EpicsService from '@sx/epics/epics-service'
import IterationsService from '@sx/iterations/iterations-service'
import KeyResultsService from '@sx/key-results/key-results-service'
import LabelsService from '@sx/labels/labels-service'
import LinkedFilesService from '@sx/linked-files/linked-files-service'
import MembersService from '@sx/members/members-service'
import ObjectivesService from '@sx/objectives/objectives-service'
import RepositoriesService from '@sx/repositories/repositories-service'
import StoriesService from '@sx/stories/stories-service'
import TeamsService from '@sx/teams/teams-service'
import UploadedFilesService from '@sx/uploaded-files/uploaded-files-service'
import {BASE_URL, createHttpClient} from '@sx/utils/http'
import WorkflowService from '@sx/workflows/workflows-service'


class Client {
  static baseUrl: string = BASE_URL

  /**
   * The single pre-authenticated HTTP client shared by every service and resource created through
   * this client. Holding the credential here — rather than in the environment — is what keeps two
   * clients constructed with different API keys fully isolated from one another.
   */
  private readonly http: AxiosInstance

  public stories: StoriesService
  public workflows: WorkflowService
  public iterations: IterationsService
  public teams: TeamsService
  public members: MembersService
  public epics: EpicsService
  public objectives: ObjectivesService
  public keyResults: KeyResultsService
  public labels: LabelsService
  public customFields: CustomFieldsService
  public linkedFiles: LinkedFilesService
  public uploadedFiles: UploadedFilesService
  public repositories: RepositoriesService

  /**
   * @param shortcutApiKey - The API key to authenticate with. Falls back to the `SHORTCUT_API_KEY`
   * environment variable, which is only read — never written.
   * @throws {Error} - If no key is given and `SHORTCUT_API_KEY` is not set
   */
  constructor(shortcutApiKey?: string) {
    const apiKey = shortcutApiKey ?? process.env.SHORTCUT_API_KEY
    if (!apiKey) throw new Error('Shortcut API Key not found')
    this.http = createHttpClient(apiKey)

    const init = { http: this.http }
    this.stories = new StoriesService(init)
    this.workflows = new WorkflowService(init)
    this.iterations = new IterationsService(init)
    this.teams = new TeamsService(init)
    this.members = new MembersService(init)
    this.epics = new EpicsService(init)
    this.objectives = new ObjectivesService(init)
    this.keyResults = new KeyResultsService(init)
    this.labels = new LabelsService(init)
    this.customFields = new CustomFieldsService(init)
    this.linkedFiles = new LinkedFilesService(init)
    this.uploadedFiles = new UploadedFilesService(init)
    this.repositories = new RepositoriesService(init)
  }
}

export { Client as default }

