import {convertKeysToCamelCase} from "@utils/convert-fields";
import axios from "axios";
import Iteration from "@iterations/iteration";


export default class IterationsService {
    public static iterations: Record<number, Iteration> = {}
    public baseUrl = 'https://api.app.shortcut.com/api/v3/iterations'
    private readonly headers: Record<string, any>

    constructor(init: { headers: Record<string, any> }) {
        this.headers = init.headers
    }

    public async create(iteration: IterationData): Promise<Iteration> {
        const response = await axios.post(this.baseUrl, iteration, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        const iterationData = convertKeysToCamelCase(response.data) as IterationData
        return new Iteration(iterationData)
    }

    public async get(id: number): Promise<Iteration> {
        if (IterationsService.iterations[id]) {
            return IterationsService.iterations[id]
        }
        const url = `${this.baseUrl}/${id}`
        const response = await axios.get(url, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        const iterationData = convertKeysToCamelCase(response.data) as IterationData
        IterationsService.iterations[id] = new Iteration(iterationData)
        return new Iteration(iterationData)
    }

    public async list(): Promise<Iteration[]> {
        const response = await axios.get(this.baseUrl, {headers: this.headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        const iterationData: IterationData[] = response.data ?? []
        return iterationData.map((iteration) => new Iteration(convertKeysToCamelCase(iteration)))
    }

}
