import {BaseSearchableService, ServiceOperation} from '@sx/base-service'
import StoryInterface from '@sx/stories/contracts/story-interface'
import Story from '@sx/stories/story'


/**
 * @inheritDoc
 */
export default class StoriesService extends BaseSearchableService<Story, StoryInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/stories'
    protected factory = (data: object) => new Story(data as StoryInterface)
    public availableOperations: ServiceOperation[] = ['get', 'search']

    constructor(init: { headers: Record<string, string> }) {
        super(init)
    }
}
