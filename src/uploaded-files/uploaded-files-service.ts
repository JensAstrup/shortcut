import axios from 'axios'

import BaseService, {ServiceOperation} from '@sx/base-service'
import Story from '@sx/stories/story'
import UploadedFileApiData from '@sx/uploaded-files/contracts/uploaded-file-api-data'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import {convertApiFields} from '@sx/utils/convert-fields'


export default class UploadedFilesService extends BaseService<UploadedFile, UploadedFileInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/files'
  public factory = (data: UploadedFileInterface) => new UploadedFile(data)
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
    const headers = {
      'Shortcut-Token': this.headers['Shortcut-Token']
    }

    try {
      const response = await axios.post(this.baseUrl, formData, {headers})
      const data = response.data as UploadedFileApiData
      const uploadedFile = convertApiFields(data) as UploadedFileInterface
      return this.factory(uploadedFile)
    } catch (error) {
      throw new Error('Failed to upload file: ' + error)
    }
  }
}
