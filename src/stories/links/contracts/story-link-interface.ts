import BaseInterface from '@sx/base-interface'

export default interface StoryLinkInterface extends BaseInterface {
    createdAt: string
    entityType: string
    id: number
    objectId: number
    subjectId: number
    type: string
    updatedAt: string
    verb: 'blocks' | 'duplicates' | 'relates to'
}
