import BaseInterface from '@sx/base-interface'


interface StoryLinkInterface extends BaseInterface {
    createdAt: string
    entityType: string
    id: number
    objectId: number
    subjectId: number
    type: string
    updatedAt: string
    verb: 'blocks' | 'duplicates' | 'relates to'
}

export { StoryLinkInterface as default }

