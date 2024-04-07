import FormData from 'form-data'
import fetch from 'node-fetch'

import BaseService, {ServiceOperation} from '@sx/base-service'
import Story from '@sx/stories/story'
import UploadedFileApiData from '@sx/uploaded-files/contracts/uploaded-file-api-data'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import {convertApiFields} from '@sx/utils/convert-fields'



class UploadedFilesService extends BaseService<UploadedFile, UploadedFileInterface> {
  public baseUrl = 'https://api.app.shortcut.com/api/v3/files'
  public factory = (data: UploadedFileInterface) => new UploadedFile(data)
  public availableOperations: ServiceOperation[] = ['list', 'get']

  /**
   * Upload a file, optionally associating it with a story
   * @param files - A file stream, or an array of file streams, to upload
   * @param story - Either an instance of {@link Story} or a story ID
   */
  async upload(files: File | Array<File>, story?: Story | number): Promise<UploadedFile> {
    const formData = new FormData()
    if (Array.isArray(files)) {
      files.forEach((file, index) => {
        formData.append(`file${index}`, file, {filename: file.name})
      })
    } else {
      formData.append('file0', files, {filename: files.name})
    }
    if (story) {
      const storyId = story instanceof Story ? story.id : story
      formData.append('story_id', storyId.toString())
    }
    const headers = this.headers
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Shortcut-Token': headers['Shortcut-Token']
      }
    })
    if (!response.ok) throw new Error('Failed to upload file' + await response.text())
    const data = await response.json() as UploadedFileApiData
    const uploadedFile = convertApiFields(data) as UploadedFileInterface
    return this.factory(uploadedFile)
  }
}

export default UploadedFilesService
