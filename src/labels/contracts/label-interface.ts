import BaseInterface from '@sx/base-interface'


interface LabelInterface extends BaseInterface {
    appUrl: string
    archived: boolean
    color: string | null
    createdAt: Date | null
    description: string | null
    entityType: string
    externalId: string | null
    id: number
    name: string
    stats: object[]
    updatedAt: Date | null
}

export { LabelInterface as default }

