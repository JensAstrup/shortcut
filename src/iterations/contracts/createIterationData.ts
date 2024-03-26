import {Label} from '@sx/iterations/contracts/iteration-interface'

export default interface CreateIterationData {
    description?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    followerIds?: string[];
    labels: Label[];
    groupIds?: string[];
}
