import axios from 'axios'
import process from 'process'
import ShortcutResource from '../src/base-resource.js'


jest.mock('axios', () => ({
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn()
}))


describe('ShortcutResource', () => {
    const mockHeaders = {
        'Content-Type': 'application/json',
        'Shortcut-Token': 'token'
    }
    process.env.SHORTCUT_API_KEY = 'token'

    describe('constructor and Proxy setup', () => {
        it('initializes with provided object', () => {
            const init = {name: 'Test'}
            const resource = new ShortcutResource(init)
            expect(resource.name).toBe('Test')
        })
    })

    describe('save method', () => {
        it('calls update if id exists', async () => {
            const resource = new ShortcutResource({id: 123})
            resource.name = 'Updated Name'
            axios.put.mockResolvedValue({data: {snake_name: 'Updated Name'}})

            await resource.save()

            expect(axios.put).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {headers: mockHeaders})
            expect(resource.name).toBe('Updated Name')
        })

        it('calls create if id does not exist', async () => {
            const resource = new ShortcutResource()
            resource.name = 'New Name'
            axios.post.mockResolvedValue({data: {id: 123, snake_name: 'New Name'}})

            await resource.save()

            expect(axios.post).toHaveBeenCalledWith(expect.any(String), expect.any(Object), {headers: mockHeaders})
            expect(resource.id).toBe(123)
            expect(resource.name).toBe('New Name')
        })
    })

    describe('delete method', () => {
        it('sends a delete request for the resource', async () => {
            const resource = new ShortcutResource({id: 123})
            axios.delete.mockResolvedValue({})

            await resource.delete()

            expect(axios.delete).toHaveBeenCalledWith(expect.any(String), {headers: mockHeaders})
        })

        it('throws an error on delete failure', async () => {
            const resource = new ShortcutResource({id: 123})
            axios.delete.mockRejectedValue(new Error('Error deleting story'))

            await expect(resource.delete()).rejects.toThrow('Error deleting story')
        })
    })
})
