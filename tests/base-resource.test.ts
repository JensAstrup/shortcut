import process from 'process'

import { AxiosInstance } from 'axios'

import Label from '../src/labels/label'
import Story from '../src/stories/story'
import Task from '../src/stories/tasks/task'

import { stubHttp } from './helpers/http'


describe('BaseResource', () => {
  let http: AxiosInstance

  beforeEach(() => {
    http = stubHttp()
    process.env.SHORTCUT_API_KEY = 'token'
  })

  describe('constructor and Proxy setup', () => {
    it('initializes with provided object', () => {
      const init = {name: 'Test'}
      const resource = new Story(init)
      expect(resource.name).toBe('Test')
    })
  })

  describe('save method', () => {
    it('calls update if id exists', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['update']
      resource.changedFields = []
      resource.name = 'Updated Name'
      resource.labels = [{name: 'label1'}, {name: 'label2'}] as Label[];
      (http.put as jest.Mock).mockResolvedValue({data: {snake_name: 'Updated Name'}})

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

      expect(http.put).toHaveBeenCalledWith(expect.any(String), expectedData)
      expect(resource.name).toBe('Updated Name')
    })

    it('throws an error on update if operation is not available', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['create']
      resource.name = 'Updated Name'

      await expect(resource.save()).rejects.toThrow('Update operation not available for this resource')
    })

    it('logs errors when server responds with a non-success status code', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['update']
      const mockError = {
        response: {
          status: 500,
          data: 'Internal Server Error',
          headers: {'content-type': 'application/json'}
        }
      };
      (http.put as jest.Mock).mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error status', 500)
      expect(console.error).toHaveBeenCalledWith('Error data', 'Internal Server Error')
      expect(console.error).toHaveBeenCalledWith('Error headers', {'content-type': 'application/json'})
    })

    // Test when no response is received (e.g., network issues)
    it('logs errors when request is made but no response is received', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['update']
      const mockError = {
        request: 'Request made but no response received'
      };
      (http.put as jest.Mock).mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error request', 'Request made but no response received')
    })

    // Test when there is an error setting up the request
    it('logs errors when an error occurs in setting up the request', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['update']
      const mockError = new Error('Error in setting up the request');
      (http.put as jest.Mock).mockRejectedValue(mockError)

      await resource.update()

      expect(console.error).toHaveBeenCalledWith('Error message', 'Error in setting up the request')
    })

    it('calls create if id does not exist', async () => {
      const resource = new Story({}).setHttp(http)
      resource.availableOperations = ['create']
      resource.name = 'New Name';
      (http.post as jest.Mock).mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(http.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    it('calls create if id does not exist and uses createFields', async () => {
      const resource = new Story({}).setHttp(http)
      resource.availableOperations = ['create']
      resource.createFields = ['snake_name']
      resource.name = 'New Name';
      (http.post as jest.Mock).mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(http.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    it('throws an error on create if operation is not available', async () => {
      const resource = new Story({}).setHttp(http)
      resource.availableOperations = ['update']
      resource.name = 'New Name'

      await expect(resource.save()).rejects.toThrow('Create operation not available for this resource')
    })
  })

  describe('delete method', () => {
    it('sends a delete request for the resource', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['delete'];
      (http.delete as jest.Mock).mockResolvedValue({})

      await resource.delete()

      expect(http.delete).toHaveBeenCalledWith(`${Story.baseUrl}/123`)
    })

    // Resources are inconsistent about where baseUrl lives: Story declares `static baseUrl`, Task
    // declares it as an instance property. delete() previously read only `this.baseUrl`, so the
    // static-only resources built a `undefined/<id>` URL. Both forms are asserted so a future change
    // to one resolution path cannot silently break the other.
    it('builds the delete url from a static baseUrl', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['delete'];
      (http.delete as jest.Mock).mockResolvedValue({})

      await resource.delete()

      const [url] = (http.delete as jest.Mock).mock.calls[0]
      expect(url).toBe(`${Story.baseUrl}/123`)
      expect(url).not.toContain('undefined')
    })

    it('builds the delete url from an instance baseUrl', async () => {
      // Task derives its instance baseUrl from storyId in the constructor, so the fixture needs one.
      const resource = new Task({id: 456, storyId: 789}).setHttp(http)
      resource.availableOperations = ['delete'];
      (http.delete as jest.Mock).mockResolvedValue({})

      await resource.delete()

      const [url] = (http.delete as jest.Mock).mock.calls[0]
      expect(url).toBe('/stories/789/tasks/456')
      expect(url).not.toContain('undefined')
    })

    it('throws an error if delete operation is not available', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['update']

      await expect(resource.delete()).rejects.toThrow('Delete operation not available for this resource')
    })

    it('throws an error on delete failure', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.availableOperations = ['delete'];
      (http.delete as jest.Mock).mockRejectedValue(new Error('Error deleting story'))

      await expect(resource.delete()).rejects.toThrow('Failed to delete resource')
    })
  })
})
