import BaseInterface from '@sx/base-interface'


enum MemberState{
    DISABLED = 'disabled',
    FULL = 'full',
    IMPORTED = 'imported',
    PARTIAL = 'partial'
}

export default interface MemberInterface extends BaseInterface {
    createdAt: string
    disabled: boolean
    entityType: string
    groupIds: string[]
    id: string
    profile: object
    role: string
    state: MemberState
    updatedAt: string
}
