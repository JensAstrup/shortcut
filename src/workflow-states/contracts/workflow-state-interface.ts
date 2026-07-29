import BaseInterface from '@sx/base-interface'


enum WorkflowStateType {
    FINISHED = 'finished',
    STARTED = 'started',
    UNSTARTED = 'unstarted'

}

interface WorkflowStateInterface extends BaseInterface {

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
