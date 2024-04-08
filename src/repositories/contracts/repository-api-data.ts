import BaseData from '@sx/base-data'


enum RepositoryType {
  BITBUCKET = 'bitbucket',
  GITHUB = 'github',
  GITLAB = 'gitlab'
}

interface RepositoryApiData extends BaseData {
  created_at: string | null
  entity_type: string | null
  external_id: string | null
  full_name: string | null
  id: number | null
  name: string | null
  type: RepositoryType | null
  updated_at: string | null
  url: string | null
}

export default RepositoryApiData
export { RepositoryType }
