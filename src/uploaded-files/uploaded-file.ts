import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UUID from '@sx/utils/uuid'


export default class UploadedFile extends ShortcutResource<UploadedFileInterface> implements UploadedFileInterface {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/files'
  public availableOperations: ResourceOperation[] = ['update', 'delete']

  constructor(init: UploadedFileInterface) {
    super(init)
    Object.assign(this, init)
    this.changedFields = []
  }

  contentType!: string
  createdAt!: Date
  description!: string | null
  entityType!: string
  externalId!: string | null
  filename!: string
  groupMentionIds!: UUID[]
  id!: number
  memberMentionIds!: UUID[]
  name!: string
  size!: number
  storyIds!: number[]
  thumbnailUrl!: string | null
  updatedAt!: Date | null
  uploaderId!: UUID
}
