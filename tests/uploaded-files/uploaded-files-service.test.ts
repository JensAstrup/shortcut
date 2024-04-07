import FormData from 'form-data'
import fetch from 'node-fetch'

import UploadedFile from '../../src/uploaded-files/uploaded-file'
import UploadedFilesService from '../../src/uploaded-files/uploaded-files-service'


jest.mock('node-fetch', () => jest.fn())
jest.mock('form-data')

describe('UploadedFilesService', () => {
  let service: UploadedFilesService

  beforeEach(() => {
    service = new UploadedFilesService({headers: {'Shortcut-Token': 'test-token'}});
    (fetch as unknown as jest.Mock).mockClear();
    (FormData as unknown as jest.Mock).mockClear();
    (FormData.prototype.append as jest.Mock).mockClear()
  })

  it('uploads a single file successfully', async () => {
    const mockFile = new File(['test'], 'testfile.png', {type: 'image/png'})
    const fakeResponse = Promise.resolve({
      ok: true,
      json: () => Promise.resolve({id: 123, url: 'http://example.com/file.png'}),
    });
    (fetch as unknown as jest.Mock).mockReturnValue(fakeResponse)

    const result = await service.upload(mockFile)

    expect(fetch).toHaveBeenCalledWith(service.baseUrl, expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
      headers: expect.objectContaining({
        'Shortcut-Token': expect.any(String)
      })
    }))
    expect(FormData.prototype.append).toHaveBeenCalledWith('file0', mockFile, {filename: mockFile.name})
    expect(result).toBeInstanceOf(UploadedFile)
  })

  it('uploads multiple files successfully', async () => {
    const mockFiles = [
      new File(['test'], 'testfile1.png', {type: 'image/png'}),
      new File(['test'], 'testfile2.png', {type: 'image/png'}),
    ]
    const fakeResponse = Promise.resolve({
      ok: true,
      json: () => Promise.resolve({id: 123, url: 'http://example.com/file.png'}),
    });
    (fetch as unknown as jest.Mock).mockReturnValue(fakeResponse)

    const result = await service.upload(mockFiles)

    expect(fetch).toHaveBeenCalledWith(service.baseUrl, expect.objectContaining({
      method: 'POST',
      body: expect.any(FormData),
      headers: expect.objectContaining({
        'Shortcut-Token': expect.any(String)
      })
    }))
    expect(FormData.prototype.append).toHaveBeenCalledWith('file0', mockFiles[0], {filename: mockFiles[0].name})
    expect(FormData.prototype.append).toHaveBeenCalledWith('file1', mockFiles[1], {filename: mockFiles[1].name})
    expect(result).toBeInstanceOf(UploadedFile)
  })

  it('throws an error when the server responds with an error', async () => {
    const mockFile = new File(['test'], 'testfile.png', {type: 'image/png'})
    const fakeResponse = Promise.resolve({
      ok: false,
      text: () => Promise.resolve('Failed to upload due to server error'),
    });
    (fetch as unknown as jest.Mock).mockReturnValue(fakeResponse)

    await expect(service.upload(mockFile)).rejects.toThrow('Failed to upload file')
  })
})
