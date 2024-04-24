import process from 'process'

import axios from 'axios'

import Label from '../src/labels/label'
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
      resource.changedFields = []
      resource.name = 'Updated Name'
      resource.labels = [{name: 'label1'}, {name: 'label2'}] as Label[]
      mockedAxios.put.mockResolvedValue({data: {snake_name: 'Updated Name'}})

      await resource.save()

      const expectedData = {
        'labels': [
          {
            'name': 'label1',
          },
          {
            'name': 'label2',
          },
        ],
        'name': 'Updated Name',
      }

      expect(axios.put).toHaveBeenCalledWith(expect.any(String), expectedData, {headers: mockHeaders})
      expect(resource.name).toBe('Updated Name')
    })

    it('throws an error on update if operation is not available', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['create']
      resource.name = 'Updated Name'

      await expect(resource.save()).rejects.toThrow('Update operation not available for this resource')
    })

    it('logs errors when server responds with a non-success status code', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['update']
      const mockError = {
        response: {
          status: 500,
          data: 'Internal Server Error',
          headers: {'content-type': 'application/json'}
        }
      }
      mockedAxios.put.mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error status', 500)
      expect(console.error).toHaveBeenCalledWith('Error data', 'Internal Server Error')
      expect(console.error).toHaveBeenCalledWith('Error headers', {'content-type': 'application/json'})
    })

    // Test when no response is received (e.g., network issues)
    it('logs errors when request is made but no response is received', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['update']
      const mockError = {
        request: 'Request made but no response received'
      }
      mockedAxios.put.mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error request', 'Request made but no response received')
    })

    // Test when there is an error setting up the request
    it('logs errors when an error occurs in setting up the request', async () => {
      const resource = new Story({id: 123})
      resource.availableOperations = ['update']
      const mockError = new Error('Error in setting up the request')
      mockedAxios.put.mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error message', 'Error in setting up the request')
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
