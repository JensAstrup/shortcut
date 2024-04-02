import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import {StoriesService, Story} from '@sx/stories'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'

export default class LinkedFile extends ShortcutResource<LinkedFileInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/linked-files'
    public availableOperations: ResourceOperation[] = ['create', 'update', 'delete']
    public createFields = ['contentType', 'description', 'name', 'size', 'storyId', 'type', 'uploaderId', 'url']

    constructor(init: LinkedFileInterface) {
        super(init)
        Object.assign(this, init)
        this.changedFields = []
    }

    get stories(): Promise<Story[]> {
        const service = new StoriesService({headers: getHeaders()})
        return service.getMany(this.storyIds)
    }

    contentType!: string
    createdAt!: Date
    description!: string
    entityType!: string
    groupMentionIds!: UUID[]
    id!: number
    memberMentionIds!: UUID[]
    name!: string
    size!: number | null
    storyIds!: number[]
    thumbnailUrl!: string | null
    type!: string
    updatedAt!: Date
    url!: string
}
