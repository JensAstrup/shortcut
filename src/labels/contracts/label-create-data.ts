import BaseCreateData from '@sx/base-create-data'


export default interface LabelCreateData extends BaseCreateData {
    color: string | null
    description: string | null
    externalId: string | null
    name: string
}
