import BaseService, {ServiceOperation} from '@sx/base-service'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import LinkedFile from '@sx/linked-files/linked-file'


class LinkedFilesService extends BaseService<LinkedFile, LinkedFileInterface> {
  public baseUrl = '/linked-files'
  public factory = (data: LinkedFileInterface): LinkedFile => new LinkedFile(data)
  public availableOperations: ServiceOperation[] = ['list', 'get']
}

export { LinkedFilesService as default }

