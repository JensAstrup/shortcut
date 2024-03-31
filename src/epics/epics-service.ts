import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import Epic from '@sx/epics/epic'
import axios from 'axios'
import EpicWorkflowApiData from '@sx/epics/workflows/contracts/epic-workflow-api-data'
import {convertApiFields} from '@sx/utils/convert-fields'
import EpicWorkflowInterface from '@sx/epics/workflows/contracts/epic-workflow-interface'


export default class EpicsService extends BaseSearchableService<Epic> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/epics'
    protected factory = (data: object) => new Epic(data)
    public availableOperations: ServiceOperation[] = ['get', 'search', 'list']

    public async getWorkflow(): Promise<EpicWorkflowInterface> {
        const workflowUrl: string = 'https://api.app.shortcut.com/api/v3/epic-workflow'
        const response = await axios.get(workflowUrl, {headers: this.headers})
        const data: EpicWorkflowApiData = response.data
        return convertApiFields(data) as EpicWorkflowInterface
    }
}
