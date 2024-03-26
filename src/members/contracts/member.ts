export default interface Member {
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
