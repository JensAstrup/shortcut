import BaseData from '@sx/base-data'


interface WorkspaceApiData extends BaseData {
  estimate_scale: Array<number>
  url_slug: string
}

export default WorkspaceApiData
