import axios from "axios";
import ShortcutResource from "../base-class";
import {Workflow, WorkflowState} from "@/workflows/workflow";
import {convertKeysToCamelCase} from "@/utils/convert-fields";

let WORKFLOW_STATES: { [key: number]: WorkflowState } = {}

export default class WorkflowService extends ShortcutResource {
    public static async getWorkflows(): Promise<Workflow[]> {
        const url: string = `https://api.app.shortcut.com/api/v3/workflows`
        const headers = {
            'Content-Type': 'application/json',
            'Shortcut-Token': process.env.SHORTCUT_API_KEY || ''
        }
        const response = await axios.get(url, {headers})
        if (response.status >= 400) {
            throw new Error("HTTP error " + response.status)
        }
        return response.data
    }

    public static async getWorkflowStates(): Promise<WorkflowState[]> {
        const workflows = await this.getWorkflows()
        const workflowStates= this.extractWorkflowStates(workflows)
        WORKFLOW_STATES = workflowStates.reduce((acc: {[key: number]: WorkflowState}, state) => {
            acc[state.id] = convertKeysToCamelCase(state) as WorkflowState
            return acc
        }, {})
        return workflowStates
    }

    private static extractWorkflowStates(workflows: Workflow[]): WorkflowState[] {
        return workflows.reduce((acc: WorkflowState[], workflow) => {
            const states = workflow.states
            acc.push(...states)
            return acc
        }, [])
    }

    public static async getWorkflowState(id: number): Promise<WorkflowState> {
        if(Object.keys(WORKFLOW_STATES).length === 0) {
            await this.getWorkflowStates()
        }
        return WORKFLOW_STATES[id]
    }
}
