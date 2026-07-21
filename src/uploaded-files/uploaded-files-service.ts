import BaseService, {ServiceOperation} from '@sx/base-service'
import Story from '@sx/stories/story'
import UploadedFileApiData from '@sx/uploaded-files/contracts/uploaded-file-api-data'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import {convertApiFields} from '@sx/utils/convert-fields'
import {handleResponseFailure} from '@sx/utils/handle-response-failure'


class UploadedFilesService extends BaseService<UploadedFile, UploadedFileInterface> {
  public baseUrl = '/files'
  public factory = (data: UploadedFileInterface): UploadedFile => new UploadedFile(data)
  public availableOperations: ServiceOperation[] = ['list', 'get']

  /**
   * Uploads a file to Shortcut, optionally associating it with a story. Note that it is unknown where non-story associated files are stored.
   * @param file - The file to upload
   * @param story - The story to associate the file with, either an instance of {@link Story} or a story ID
   */
  async upload(file: Buffer, story?: Story | number): Promise<UploadedFile> {
    const formData = new FormData()
    formData.append('file0', file)
    if (story) {
      const storyId = story instanceof Story ? story.id : story
      formData.append('story_id', storyId.toString())
    }
    // Drop the client's default JSON content type so that axios derives the content type from the
    // FormData body, matching what this request sent before the client carried a default. Note that
    // `null` is not equivalent — axios serializes it to the literal string "null".
    const headers = {'Content-Type': undefined}

    try {
      const response = await this.http.post(this.baseUrl, formData, {headers}).catch((error) => {
        handleResponseFailure(error, {formData})
        throw new Error('Failed to upload file: ' + error)
      })
      const data = response.data as UploadedFileApiData
      const uploadedFile = convertApiFields<UploadedFileApiData, UploadedFileInterface>(data)
      return this.build(uploadedFile)
    }
    catch (error) {
      throw new Error('Failed to upload file: ' + String(error), {cause: error})
    }
  }
}

export { UploadedFilesService as default }

