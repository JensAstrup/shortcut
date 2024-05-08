import BaseInterface from '@sx/base-interface'
import BaseResource from '@sx/base-resource'
import BaseService from '@sx/base-service'
import MembersService from '@sx/members/members-service'
import {getHeaders} from '@sx/utils/headers'
import UUID from '@sx/utils/uuid'
import WorkflowStatesService from '@sx/workflow-states/workflow-states-service'


interface ResourceMap {
  // Define a map of keys to resources, where the key is the field name in the data, and the value is a constructor for the resource and service
  [key: string]: {
    operation: 'get' | 'getMany'
    service: typeof BaseService<BaseResource, BaseInterface>,
  }
}

class ResourceConverter {

  private resourceMap: ResourceMap = {
    memberId: {service: MembersService, operation: 'get'},
    workflowStateId: {service: WorkflowStatesService, operation: 'get'},
  }


  async getResourceFromId(resourceId: UUID | UUID[] | number | number[], key: string | number): Promise<BaseResource | Array<BaseResource | null> | null> {
    if (!this.resourceMap[key]) return null
    const service = new this.resourceMap[key].service({headers: getHeaders()})
    if (this.resourceMap[key].operation === 'get') {
      return service.get(<UUID | string>resourceId)
    }
    else if (this.resourceMap[key].operation === 'getMany') {
      return service.getMany(<UUID[] | string[]>resourceId)
    }
    return null
  }
}

export default ResourceConverter
