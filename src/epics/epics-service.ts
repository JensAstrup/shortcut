import axios from 'axios'

import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import EpicInterface from '@sx/epics/contracts/epic-interface'
import Epic from '@sx/epics/epic'
import EpicWorkflowApiData from '@sx/epics/workflows/contracts/epic-workflow-api-data'
import EpicWorkflowInterface from '@sx/epics/workflows/contracts/epic-workflow-interface'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'


export default class EpicsService extends BaseSearchableService<Epic, EpicInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/epics'
  protected factory = (data: object) => new Epic(data)
  public availableOperations: ServiceOperation[] = ['get', 'search', 'list']

  public async getWorkflow(): Promise<EpicWorkflowInterface> {
    const workflowUrl: string = 'https://api.app.shortcut.com/api/v3/epic-workflow'
    const response = await axios.get(workflowUrl, {headers: this.headers}).catch((error) => {
      handleResponseFailure(error, {})
      return
    })
    if (!response) {
      throw new Error('Failed to fetch epic workflow')
    }
    const data: EpicWorkflowApiData = response.data
    return convertApiFields(data) as EpicWorkflowInterface
  }
}
