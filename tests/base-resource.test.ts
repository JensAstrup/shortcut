import process from 'process'

import axios from 'axios'

import Story from '../src/stories/story'


jest.mock('axios')
import mocked = jest.mocked


const mockedAxios = mocked(axios)

describe('ShortcutResource', () => {
  const mockHeaders = {
    'Content-Type': 'application/json',
    'Shortcut-Token': 'token'
  }
  process.env.SHORTCUT_API_KEY = 'token'

  describe('constructor and Proxy setup', () => {
    it('initializes with provided object', () => {
      const init = {name: 'Test'}
      const resource = new Story(init)
      expect(resource.name).toBe('Test')
    })
  })

  describe('save method', () => {
    it('calls update if id exists', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['update']
      resource.name = 'Updated Name'
      mockedAxios.put.mockResolvedValue({data: {snake_name: 'Updated Name'}})

      await resource.save()

      expect(axios.put).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {headers: mockHeaders})
      expect(resource.name).toBe('Updated Name')
    })

    it('throws an error on update if operation is not available', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['create']
      resource.name = 'Updated Name'

      await expect(resource.save()).rejects.toThrow('Update operation not available for this resource')
    })

    it('calls create if id does not exist', async () => {
      const resource = new Story({})
      resource.availableOperations = ['create']
      resource.name = 'New Name'
      mockedAxios.post.mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {headers: mockHeaders})
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    it('calls create if id does not exist and uses createFields', async () => {
      const resource = new Story({})
      resource.availableOperations = ['create']
      resource.createFields = ['snake_name']
      resource.name = 'New Name'
      mockedAxios.post.mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(mockedAxios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {headers: mockHeaders})
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    it('throws an error on create if operation is not available', async () => {
      const resource = new Story({})
      resource.availableOperations = ['update']
      resource.name = 'New Name'

      await expect(resource.save()).rejects.toThrow('Create operation not available for this resource')
    })
  })

  describe('delete method', () => {
    it('sends a delete request for the resource', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['delete']
      mockedAxios.delete.mockResolvedValue({})

      await resource.delete()

      expect(mockedAxios.delete).toHaveBeenCalledWith(expect.any(String), {headers: mockHeaders})
    })

    it('throws an error if delete operation is not available', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['update']

      await expect(resource.delete()).rejects.toThrow('Delete operation not available for this resource')
    })

    it('throws an error on delete failure', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['delete']
      mockedAxios.delete.mockRejectedValue(new Error('Error deleting story'))

      await expect(resource.delete()).rejects.toThrow('Error deleting story')
    })
  })
})
