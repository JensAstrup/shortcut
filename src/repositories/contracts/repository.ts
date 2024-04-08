import BaseInterface from '@sx/base-interface'
import {RepositoryType} from '@sx/repositories/contracts/repository-api-data'


interface RepositoryInterface extends BaseInterface {
  createdAt: Date | null
  entityType: string | null
  externalId: string | null
  fullName: string | null
  id: number | null
  name: string | null
  type: RepositoryType
  updatedAt: Date | null
  url: string | null
}

export default RepositoryInterface
