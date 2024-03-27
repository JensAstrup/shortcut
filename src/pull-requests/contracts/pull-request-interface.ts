import BaseInterface from '@sx/base-interface'


export interface PullRequestInterface extends BaseInterface{
    branchId: number
    branchName: string
    buildStatus: string
    closed: boolean
    createdAt: Date
    draft: boolean
    entityType: string
    hasOverlappingStories: boolean
    id: number
    merged: boolean
    numAdded: number
    numCommits: number
    numModified: number
    numRemoved: number
    number: number
    overlappingStories: number[]
    repositoryId: number
    reviewStatus: string
    targetBranchId: number
    targetBranchName: string
    title: string
    updatedAt: Date
    url: string
    vcsLabels: Record<string, unknown>[]
}