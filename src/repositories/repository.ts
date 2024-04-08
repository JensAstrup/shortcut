import ShortcutResource, {ResourceOperation} from '@sx/base-resource'
import RepositoryInterface from '@sx/repositories/contracts/repository'
import {RepositoryType} from '@sx/repositories/contracts/repository-api-data'


class Repository extends ShortcutResource<RepositoryInterface> implements RepositoryInterface {
  public availableOperations: ResourceOperation[] = []

  createdAt: Date | null
  entityType: string | null
  externalId: string | null
  fullName: string | null
  id: number | null
  name: string | null
  type: RepositoryType
  updatedAt: Date | null
  url: string | null

  constructor(init: RepositoryInterface) {
    super()
    Object.assign(this, init)
    this.changedFields = []
  }
}

export default Repository
