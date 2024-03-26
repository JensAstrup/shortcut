import {convertApiFields} from '@sx/utils/convert-fields'
import axios from 'axios'
import Iteration from '@sx/iterations/iteration'
import CreateIterationData from '@sx/iterations/contracts/createIterationData'
import BaseService from '@sx/base-service'
import IterationInterface from '@sx/iterations/contracts/iteration-interface'


export default class IterationsService extends BaseService<Iteration> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    protected factory = (data: object) => new Iteration(data)
    public static iterations: Record<number, Iteration> = {}

    public async create(iteration: CreateIterationData): Promise<Iteration> {
        const response = await axios.post(this.baseUrl, iteration, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        const iterationData = convertApiFields(response.data) as IterationInterface
        return new Iteration(iterationData)
    }
}
