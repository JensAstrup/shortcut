import BaseInterface from '@sx/base-interface'

export default interface LabelInterface extends BaseInterface {
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
