import {AxiosInstance} from 'axios'

import BaseInterface from '@sx/base-interface'
import BaseResource from '@sx/base-resource'
import BaseService from '@sx/base-service'
import MembersService from '@sx/members/members-service'
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
  private readonly http: AxiosInstance
  /**
   * Services are reused across conversions. {@link WorkflowStatesService} caches the workflow list on
   * the instance, so building a fresh service per call would refetch every workflow for each id
   * converted.
   */
  private services: Record<string, BaseService<BaseResource, BaseInterface>> = {}

  private resourceMap: ResourceMap = {
    memberId: {service: MembersService, operation: 'get'},
    workflowStateId: {service: WorkflowStatesService, operation: 'get'},
  }

  constructor(http: AxiosInstance) {
    this.http = http
  }

  private serviceFor(key: string): BaseService<BaseResource, BaseInterface> {
    if (!this.services[key]) {
      this.services[key] = new this.resourceMap[key].service({http: this.http})
    }
    return this.services[key]
  }

  async getResourceFromId(resourceId: UUID | UUID[] | number | number[], key: string | number): Promise<BaseResource | Array<BaseResource | null> | null> {
    if (!this.resourceMap[key]) return null
    const service = this.serviceFor(String(key))
    if (this.resourceMap[key].operation === 'get') {
      return service.get(<UUID  >resourceId)
    }
    else if (this.resourceMap[key].operation === 'getMany') {
      return service.getMany(<UUID[]  >resourceId)
    }
    return null
  }
}

export default ResourceConverter
