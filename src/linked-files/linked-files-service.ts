import BaseService, {ServiceOperation} from '@sx/base-service'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import LinkedFile from '@sx/linked-files/linked-file'


export default class LinkedFilesService extends BaseService<LinkedFile, LinkedFileInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/linked-files'
  public factory = (data: LinkedFileInterface) => new LinkedFile(data)
  public availableOperations: ServiceOperation[] = ['list', 'get']
}
