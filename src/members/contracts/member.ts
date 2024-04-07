import BaseInterface from '@sx/base-interface'


export default interface MemberInterface extends BaseInterface {
    createdAt: string
    disabled: boolean
    entityType: string
    groupIds: string[]
    id: string
    profile: object
    role: string
    state: 'disabled' | 'full' | 'imported' | 'partial'
    updatedAt: string
}
