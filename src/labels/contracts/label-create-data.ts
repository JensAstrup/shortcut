import BaseCreateData from '@sx/base-create-data'


interface LabelCreateData extends BaseCreateData {
    color: string | null
    description: string | null
    externalId: string | null
    name: string
}

export { LabelCreateData as default }

