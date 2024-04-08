import BaseInterface from '@sx/base-interface'


enum WorkflowStateType {
    FINISHED = 'Finished',
    STARTED = 'Started',
    UNSTARTED = 'Unstarted'

}

interface WorkflowStateInterface extends BaseInterface {
    [index: string]: unknown

    color: string // Assuming color is a hex string (e.g., "#FFFFFF")
    createdAt: Date
    description: string
    entityType: string
    id: number
    name: string
    numStories: number
    numStoryTemplates: number
    position: number
    type: WorkflowStateType
    updatedAt: Date
    verb: string | null
}

export default WorkflowStateInterface
export { WorkflowStateType }