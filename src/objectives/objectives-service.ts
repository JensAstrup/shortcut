import BaseService from '@sx/base-service'
import Objective from '@sx/objectives/objective'
import axios from 'axios'
import {convertApiFields} from '@sx/utils/convert-fields'
import ObjectiveApiData from '@sx/objectives/contracts/objective-api-data'
import * as console from 'console'

export default class ObjectivesService extends BaseService<Objective> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/objectives'
    protected factory = (data: object) => new Objective(data)

    public async search(query: string): Promise<Objective[]> {
        const url = new URL('https://api.app.shortcut.com/api/v3/search/objectives')
        url.search = new URLSearchParams({query: query}).toString()

        const response = await axios.get(url.toString(), {headers: this.headers})
        console.log(response)
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }

        const objectiveData: ObjectiveApiData[] = response.data.data ?? []
        return objectiveData.map((objective) => new Objective(convertApiFields(objective)))

    }
}
