import axios from 'axios'
import ShortcutResource from '../base-resource'
import {convertApiFields} from '@sx/utils/convert-fields'
import {WorkflowInterface} from '@sx/workflows/contracts/workflow-interface'
import {WorkflowStateInterface} from '@sx/workflows/contracts/workflow-state-interface'

const WORKFLOW_STATES: { [key: number]: WorkflowStateInterface } = {}

export default class WorkflowService extends ShortcutResource {
    public static async getWorkflows(): Promise<WorkflowInterface[]> {
        const url: string = 'https://api.app.shortcut.com/api/v3/workflows'
        const headers = {
            'Content-Type': 'application/json',
            'Shortcut-Token': process.env.SHORTCUT_API_KEY || ''
        }
        const response = await axios.get(url, {headers})
        if (response.status >= 400) {
            throw new Error('HTTP error ' + response.status)
        }
        return response.data as WorkflowInterface[]
    }

    public static async getWorkflowStates(): Promise<WorkflowStateInterface[]> {
        const workflows: WorkflowInterface[] = await this.getWorkflows()
        const workflowStates: WorkflowStateInterface[] = this.extractWorkflowStates(workflows)

        for (const state of workflowStates) {
            WORKFLOW_STATES[state.id] = convertApiFields(state) as WorkflowStateInterface
        }

        return workflowStates
    }

    private static extractWorkflowStates(workflows: WorkflowInterface[]): WorkflowStateInterface[] {
        return workflows.reduce((acc: WorkflowStateInterface[], workflow) => {
            const states = workflow.states
            acc.push(...states)
            return acc
        }, [])
    }

    public static async getWorkflowState(id: number): Promise<WorkflowStateInterface> {
        if(Object.keys(WORKFLOW_STATES).length === 0) {
            await this.getWorkflowStates()
        }
        return WORKFLOW_STATES[id]
    }
}
