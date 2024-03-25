import {convertKeysToCamelCase} from '@sx/utils/convert-fields'
import axios from 'axios'
import Iteration from '@sx/iterations/iteration'
import {IterationData} from '@sx/iterations/contracts/iterationData'
import CreateIterationData from '@sx/iterations/contracts/createIterationData'
import BaseService from '@sxbase-service'


export default class IterationsService extends BaseService<Iteration> {
    public static iterations: Record<number, Iteration> = {}
    public baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'

    public async create(iteration: CreateIterationData): Promise<Iteration> {
        const response = await axios.post(this.baseUrl, iteration, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const iterationData = convertKeysToCamelCase(response.data) as IterationData
        return new Iteration(iterationData)
    }
}
