import axios from 'axios'
import AxiosMockAdapter from 'axios-mock-adapter'

import Story from '@sx/stories/story'
import UploadedFileInterface from '@sx/uploaded-files/contracts/uploaded-file-interface'
import UploadedFile from '@sx/uploaded-files/uploaded-file'
import UploadedFilesService from '@sx/uploaded-files/uploaded-files-service'


const axiosMock = new AxiosMockAdapter(axios)
const service = new UploadedFilesService({headers: {'Shortcut-Token': 'test-token'}})

describe('UploadedFilesService', () => {
  afterEach(() => {
    axiosMock.reset()
    jest.clearAllMocks()
  })
  it('uploads a single file successfully', async () => {
    const file = Buffer.from('123')
    const mockResponse = {id: 1, name: 'test.txt', url: 'http://example.com/test.txt'}
    axiosMock.onPost(service.baseUrl).reply(200, mockResponse)

    const result = await service.upload(file)

    expect(result).toEqual(new UploadedFile(mockResponse as unknown as UploadedFileInterface))
  })


  it('uploads a file to a story successfully', async () => {
    const file = Buffer.from('fileContent')
    const story = new Story({id: 1, name: 'Test Story'})
    const mockResponse = {id: 1, name: 'test.txt', url: 'http://example.com/test.txt'}
    axiosMock.onPost(service.baseUrl).reply(200, mockResponse)

    const result = await service.upload(file, story)

    expect(result).toEqual(new UploadedFile(mockResponse as unknown as UploadedFileInterface))
  })

  it('uploads to a file with a story number successfully', async () => {
    const file = Buffer.from('fileContent')
    const story = 1
    const mockResponse = {id: 1, name: 'test.txt', url: 'http://example.com/test.txt'}
    axiosMock.onPost(service.baseUrl).reply(200, mockResponse)

    const result = await service.upload(file, story)

    expect(result).toEqual(new UploadedFile(mockResponse as unknown as UploadedFileInterface))
  })

  it('throws an error when the upload fails', async () => {
    const file = Buffer.from('fileContent')
    axiosMock.onPost(service.baseUrl).reply(500)

    await expect(service.upload(file)).rejects.toThrow('Failed to upload file')
  })

  it('throws an error when the upload fails with a request error', async () => {
    const file = Buffer.from('fileContent')
    axiosMock.onPost(service.baseUrl).networkError()

    await expect(service.upload(file)).rejects.toThrow('Failed to upload file: Error: Network Error')
  })

})
