import BaseData from '@sx/base-data'


interface HistoryActionApiData extends BaseData {
    id: number
    entity_type: string
    action: string
    name: string
    storyType: string
    app_url: string
    changes: Record<string, string | number | boolean>
}

export { HistoryActionApiData as default }
