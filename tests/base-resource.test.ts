import process from 'process'

import { AxiosInstance } from 'axios'

import {ResourceBaseFor, Updatable} from '@sx/base-resource'
import Iteration from '@sx/iterations/iteration'
import Label from '@sx/labels/label'
import Story from '@sx/stories/story'
import Task from '@sx/stories/tasks/task'

import { stubHttp } from './helpers/http'


// A resource that only composes `Updatable`, so `save()` resolves to `Updatable`'s implementation
// rather than being overridden by `Creatable`'s (as happens for every resource that has both).
class UpdatableOnlyResource extends Updatable(ResourceBaseFor()) {
  public static baseUrl = '/mock-updatable'
}

// Composes no capability mixins and declares no `baseUrl` in either form, to exercise ResourceCore
// directly rather than through a concrete resource's overrides.
class BareResource extends ResourceBaseFor() {
}


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

    // Concrete resources all call `super()` bare and assign `init` themselves, so ResourceCore's own
    // `if (init) Object.assign(this, init)` branch is otherwise never exercised.
    it('assigns init directly when constructed through the base class', () => {
      const resource = new BareResource({name: 'Bare'})
      expect(resource.name).toBe('Bare')
    })

    it('throws when neither a static nor instance baseUrl is declared', () => {
      const resource = new BareResource()
      expect(() => resource.resourceUrl).toThrow('You must override baseUrl in the subclass')
    })
  })

  describe('save method', () => {
    it('calls update if id exists', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      resource.changedFields = []
      resource.name = 'Updated Name'
      resource.labels = [{name: 'label1'}, {name: 'label2'}] as Label[]
      const put = http.put as jest.Mock
      put.mockResolvedValue({data: {snake_name: 'Updated Name'}})

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

    it('logs errors when server responds with a non-success status code', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const mockError = {
        response: {
          status: 500,
          data: 'Internal Server Error',
          headers: {'content-type': 'application/json'}
        }
      }
      const put = http.put as jest.Mock
      put.mockRejectedValue(mockError)

      await expect(resource.update()).rejects.toThrow('Failed to update resource')

      expect(console.error).toHaveBeenCalledWith('Error status', 500)
      expect(console.error).toHaveBeenCalledWith('Error data', 'Internal Server Error')
      expect(console.error).toHaveBeenCalledWith('Error headers', {'content-type': 'application/json'})
    })

    // Test when no response is received (e.g., network issues)
    it('logs errors when request is made but no response is received', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const mockError = {
        request: 'Request made but no response received'
      }
      const put = http.put as jest.Mock
      put.mockRejectedValue(mockError)

      await expect(resource.update()).rejects.toThrow('Failed to update resource')

      expect(console.error).toHaveBeenCalledWith('Error request', 'Request made but no response received')
    })

    // Test when there is an error setting up the request
    it('logs errors when an error occurs in setting up the request', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const mockError = new Error('Error in setting up the request')
      const put = http.put as jest.Mock
      put.mockRejectedValue(mockError)

      await expect(resource.update()).rejects.toThrow('Failed to update resource')

      expect(console.error).toHaveBeenCalledWith('Error message', 'Error in setting up the request')
    })

    it('calls create if id does not exist', async () => {
      const resource = new Story({}).setHttp(http)
      resource.name = 'New Name'
      const post = http.post as jest.Mock
      post.mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(http.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    it('calls create if id does not exist and uses createFields', async () => {
      const resource = new Story({}).setHttp(http)
      resource.createFields = ['snake_name']
      resource.name = 'New Name';
      (http.post as jest.Mock).mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

      await resource.save()

      expect(http.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object))
      expect(resource.id).toBe(123)
      expect(resource.name).toBe('New Name')
    })

    // Iteration is the resource that actually declares `dateOnlyFields`, so it exercises the real
    // subclass-configured path rather than reaching into BaseResource's protected field from outside.
    it('serializes dateOnlyFields as YYYY-MM-DD on create', async () => {
      const startDate = new Date('2026-07-29T12:31:07.768Z')
      const endDate = new Date('2026-08-05T12:31:07.768Z')
      const resource = new Iteration({name: 'Iteration 1', startDate, endDate}).setHttp(http)
      const post = http.post as jest.Mock
      post.mockResolvedValue({data: {id: 1}})

      await resource.save()

      const [, body] = post.mock.calls[0] as [string, { start_date: string; end_date: string }]
      expect(body.start_date).toBe('2026-07-29')
      expect(body.end_date).toBe('2026-08-05')
    })

    it('serializes dateOnlyFields as YYYY-MM-DD on update', async () => {
      const startDate = new Date('2026-07-29T12:31:07.768Z')
      const resource = new Iteration({id: 1}).setHttp(http)
      resource.changedFields = []
      resource.startDate = startDate
      const put = http.put as jest.Mock
      put.mockResolvedValue({data: {id: 1}})

      await resource.save()

      const [, body] = put.mock.calls[0] as [string, { start_date: string }]
      expect(body.start_date).toBe('2026-07-29')
    })

    it('leaves Date fields not listed in dateOnlyFields as full Date values', async () => {
      const resource = new Story({}).setHttp(http)
      resource.createFields = ['deadline']
      const deadline = new Date('2026-07-29T12:31:07.768Z')
      resource.deadline = deadline
      const post = http.post as jest.Mock
      post.mockResolvedValue({data: {id: 1}})

      await resource.save()

      const [, body] = post.mock.calls[0] as [string, { deadline: string }]
      expect(body.deadline).toBe(deadline)
    })

    // Every resource that composes `Creatable` also composes `Updatable`, and `Creatable`'s `save()`
    // shadows `Updatable`'s on the prototype chain — so an update-only resource is needed to reach
    // `Updatable`'s own `save()` body rather than always going through `Creatable`'s copy.
    it('dispatches save() to update() on an update-only resource', async () => {
      const resource = new UpdatableOnlyResource({id: 1}).setHttp(http)
      resource.changedFields = []
      resource.name = 'Changed';
      (http.put as jest.Mock).mockResolvedValue({data: {}})

      await resource.save()

      expect(http.put).toHaveBeenCalledWith('/mock-updatable/1', {name: 'Changed'})
    })

    it('throws a descriptive error when create fails', async () => {
      const resource = new Story({}).setHttp(http)
      resource.name = 'New Name'
      const mockError = {
        response: {
          status: 422,
          data: {message: 'Invalid'},
          headers: {'content-type': 'application/json'}
        }
      };
      (http.post as jest.Mock).mockRejectedValue(mockError)

      await expect(resource.save()).rejects.toThrow('Error creating resource: HTTP 422 {"message":"Invalid"}')
    })

    it('throws an HTTP error when create resolves with a non-success status', async () => {
      const resource = new Story({}).setHttp(http)
      resource.name = 'New Name';
      (http.post as jest.Mock).mockResolvedValue({status: 422, data: {message: 'Invalid'}})

      await expect(resource.save()).rejects.toThrow('HTTP error 422 {"message":"Invalid"}')
    })
  })

  describe('delete method', () => {
    it('sends a delete request for the resource', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const del = http.delete as jest.Mock
      del.mockResolvedValue({})

      await resource.delete()

      expect(http.delete).toHaveBeenCalledWith(`${Story.baseUrl}/123`)
    })

    // Resources are inconsistent about where baseUrl lives: Story declares `static baseUrl`, Task
    // declares it as an instance property. delete() previously read only `this.baseUrl`, so the
    // static-only resources built a `undefined/<id>` URL. Both forms are asserted so a future change
    // to one resolution path cannot silently break the other.
    it('builds the delete url from a static baseUrl', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const del = http.delete as jest.Mock
      del.mockResolvedValue({})

      await resource.delete()

      const [url] = del.mock.calls[0] as [string]
      expect(url).toBe(`${Story.baseUrl}/123`)
      expect(url).not.toContain('undefined')
    })

    it('builds the delete url from an instance baseUrl', async () => {
      // Task derives its instance baseUrl from storyId in the constructor, so the fixture needs one.
      const resource = new Task({id: 456, storyId: 789}).setHttp(http)
      const del = http.delete as jest.Mock
      del.mockResolvedValue({})

      await resource.delete()

      const [url] = del.mock.calls[0] as [string]
      expect(url).toBe('/stories/789/tasks/456')
      expect(url).not.toContain('undefined')
    })

    it('throws an error on delete failure', async () => {
      const resource = new Story({id: 123}).setHttp(http)
      const del = http.delete as jest.Mock
      del.mockRejectedValue(new Error('Error deleting story'))

      await expect(resource.delete()).rejects.toThrow('Failed to delete resource')
    })
  })
})
