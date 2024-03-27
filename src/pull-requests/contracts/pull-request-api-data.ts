export interface PullRequestApiData {
    branch_id: number
    branch_name: string
    build_status: string
    closed: boolean
    created_at: string
    draft: boolean
    entity_type: string
    has_overlapping_stories: boolean
    id: number
    merged: boolean
    num_added: number
    num_commits: number
    num_modified: number
    num_removed: number
    number: number
    overlapping_stories: number[]
    repository_id: number
    review_status: string
    target_branch_id: number
    target_branch_name: string
    title: string
    updated_at: string
    url: string
    vcs_labels: Record<string, unknown>[]
}