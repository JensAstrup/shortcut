import BaseInterface from '@sx/base-interface'
import UUID from '@sx/utils/uuid'


enum HistoryActionEnum{
    BULK_UPDATE = 'bulk-update',
    CLOSE = 'close',
    COMMENT = 'comment',
    CREATE = 'create',
    DELETE = 'delete',
    MERGE = 'merge',
    PUSH = 'push',
    REOPEN = 'reopen',
    SYNC = 'sync',
    UPDATE = 'update',
}

interface HistoryActionChangeInterface {
    [key: string]: string | number | object | undefined
    new?: string | number
    old?: string | number
    adds?: number[]
    removes?: number[]
}

interface HistoryActionInterface extends BaseInterface {
    action: HistoryActionEnum
    appUrl: string
    blocked?: boolean
    blocker?: boolean
    completed?: boolean
    customFieldValueIds?: UUID[]
    deadline?: Date
    description?: string
    entityType: string
    epicId?: number
    estimate?: number
    followerIds?: UUID[]
    groupId?: UUID
    id: number
    iterationId?: number | null
    labelIds?: number[]
    name: string
    objectStoryLinkIds?: number[]
    ownerIds?: UUID[]
    projectId?: number
    requestedById?: UUID
    started?: boolean
    storyType: string
    subjectStoryLinkIds?: number[]
    taskIds?: number[]
    workflowStateId?: number
    changes: Array<{[key:string]: HistoryActionChangeInterface | undefined, workflowStateId?: HistoryActionChangeInterface}>
}

export default HistoryActionInterface
export { HistoryActionChangeInterface, HistoryActionEnum }
