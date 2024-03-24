import {Label} from '@iterations/contracts/iteration'

export default interface CreateIterationData {
    description?: string;
    name: string;
    startDate: Date;
    endDate: Date;
    followerIds?: string[];
    labels: Label[];
    groupIds?: string[];
}
