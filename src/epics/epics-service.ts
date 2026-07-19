import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import EpicInterface from '@sx/epics/contracts/epic-interface'
import Epic from '@sx/epics/epic'
import EpicWorkflowApiData from '@sx/epics/workflows/contracts/epic-workflow-api-data'
import EpicWorkflowInterface from '@sx/epics/workflows/contracts/epic-workflow-interface'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'


class EpicsService extends BaseSearchableService<Epic, EpicInterface> {
  public baseUrl = '/epics'
  protected factory = (data: object): Epic => new Epic(data)
  public availableOperations: ServiceOperation[] = ['get', 'search', 'list']

  public async getWorkflow(): Promise<EpicWorkflowInterface> {
    const workflowUrl: string = '/epic-workflow'
    const response = await this.http.get(workflowUrl).catch((error) => {
      handleResponseFailure(error, {})
      return
    })
    if (!response) {
      throw new Error('Failed to fetch epic workflow')
    }
    const data: EpicWorkflowApiData = response.data
    return convertApiFields<EpicWorkflowApiData, EpicWorkflowInterface>(data)
  }
}

export { EpicsService as default }

