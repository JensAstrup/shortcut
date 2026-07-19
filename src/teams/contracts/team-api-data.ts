import BaseData from '@sx/base-data'


interface TeamApiData extends BaseData {
    app_url: string
    archived: boolean
    color: string
    color_key: string
    description: string
    display_icon: string
    entity_type: string
    id: string
    member_ids: number[]
    mention_name: string
    name: string
    num_epics_started: number
    num_stories_started: number
    workflow_ids: number[]
}

export { TeamApiData as default }

