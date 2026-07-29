import {Deletable, ResourceBaseFor, Updatable} from '@sx/base-resource'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UUID from '@sx/utils/uuid'


class UploadedFile extends Deletable(Updatable(ResourceBaseFor<UploadedFileInterface>())) implements UploadedFileInterface {
  public baseUrl = '/files'

  constructor(init: UploadedFileInterface) {
    super(init)
    Object.assign(this, init)
    this.changedFields = []
  }

  contentType: string
  createdAt: Date
  description: string | null
  entityType: string
  externalId: string | null
  filename: string
  groupMentionIds: UUID[]
  id: number
  memberMentionIds: UUID[]
  name: string
  size: number
  storyIds: number[]
  thumbnailUrl: string | null
  updatedAt: Date | null
  uploaderId: UUID
}

export { UploadedFile as default }

