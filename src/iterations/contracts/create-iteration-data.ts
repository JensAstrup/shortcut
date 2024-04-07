import BaseCreateData from '@sx/base-create-data'
import {Label} from '@sx/iterations/contracts/iteration-interface'


export default interface CreateIterationData extends BaseCreateData {
    description?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    followerIds?: string[];
    labels: Label[];
    groupIds?: string[];
}
