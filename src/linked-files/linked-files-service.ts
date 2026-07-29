import {Gettable, Listable, ServiceBaseFor} from '@sx/base-service'
import LinkedFileInterface from '@sx/linked-files/contracts/linked-file-interface'
import LinkedFile from '@sx/linked-files/linked-file'


class LinkedFilesService extends Listable(Gettable(ServiceBaseFor<LinkedFile, LinkedFileInterface>())) {
  public baseUrl = '/linked-files'
  public factory = (data: LinkedFileInterface): LinkedFile => new LinkedFile(data)
}

export { LinkedFilesService as default }

