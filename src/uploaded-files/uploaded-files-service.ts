import BaseService, {ServiceOperation} from '@sx/base-service'
import UploadedFileInterface from '@sx/uploaded-files/interfaces/uploaded-file-interface'
import UploadedFile from '@sx/uploaded-files/uploaded-file'

export default class UploadedFilesService extends BaseService<UploadedFile, UploadedFileInterface> {
    public baseUrl = 'https://api.app.shortcut.com/api/v3/files'
    public factory = (data: UploadedFileInterface) => new UploadedFile(data)
    public availableOperations: ServiceOperation[] = ['list', 'get']
}
