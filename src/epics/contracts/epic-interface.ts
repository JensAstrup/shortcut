import UUID from '@sx/utils/uuid'


export default interface EpicInterface {
    appUrl: string
    archived: boolean
    associatedGroups: []
    completed: boolean
    completedAt: string | null
    completedAtOverride: string | null
    deadline: string | null
    description: string
    entityType: string
    epicStateId: number
    externalId: string | null
    followerIds: UUID[]
    groupIds: UUID[]
    id: number
    labelIds: number[]
    labels: []
    memberMentionIds: UUID[]
    mentionIds: UUID[]
    milestoneId: number | null
    name: string
    objectiveIds: number[]
    ownerIds: UUID[]
    plannedStartDate: string | null
    position: number
    productboardId: UUID | null
    productboardName: string | null
    productboardPluginId: UUID | null
    productboardUrl: string | null
    projectIds: number[]
    requestedById: UUID
    started: boolean
    startedAt: string | null
    startedAtOverride: string | null
    stats: object
    storiesWithoutProjects: number
    updatedAt: string | null
}