import BaseInterface from '@sx/base-interface'


export default interface HistoryActionInterface extends BaseInterface {
    id: number
    entityType: string
    action: string
    name: string
    storyType: string
    appUrl: string
    changes: Record<string, string | number | boolean>
}