import BaseInterface from '@sx/base-interface'


// Placeholders: the API shapes are not yet modelled. `object` rather than an empty interface, which
// would accept any non-nullish value including primitives.
type Label = object

type IterationStats = object

enum IterationStatus {
    DONE = 'done',
    STARTED = 'started',
    UNSTARTED = 'unstarted'
}

interface IterationInterface extends BaseInterface {
    appUrl: string;
    createdAt: Date;
    endDate: Date;
    entityType: string;
    followerIds: string[];
    groupIds: string[];
    groupMentionIds: string[];
    id: number;
    labelIds: number[];
    labels: Label[];
    memberMentionIds: string[];
    mentionIds: string[];
    name: string;
    startDate: Date;
    stats: IterationStats;
    status: IterationStatus
    updatedAt: Date;
}

export default IterationInterface
export { IterationStatus, type Label, type IterationStats }
