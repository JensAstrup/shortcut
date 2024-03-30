import Client from '../src/client'


describe('Client', () => {
    let originalProcessEnv
    const contentType = 'application/json'
    const shortcutApiKey = 'fakekey'

    beforeAll(() => {
        originalProcessEnv = {...process.env}
        process.env.SHORTCUT_API_KEY = 'fakeEnvKey'
    })

    afterAll(() => {
        process.env = {...originalProcessEnv}
    })

    it('creates new instance with shortcutApiKey', () => {
        const client = new Client(shortcutApiKey)
        const expectedHeaders = {
            'Content-Type': 'application/json',
            'Shortcut-Token': shortcutApiKey
        }
        expect(client.headers).toEqual(expectedHeaders)
    })

    it('creates new instance with shortcutApiKey from env', () => {
        const client = new Client()
        const expectedHeaders = {
            'Content-Type': 'application/json',
            'Shortcut-Token': process.env.SHORTCUT_API_KEY
        }
        expect(client.headers).toEqual(expectedHeaders)
    })

    it('throws an error when shortcutApiKey and SHORTCUT_API_KEY are not defined', () => {
        process.env.SHORTCUT_API_KEY = ''
        expect(() => new Client()).toThrow(Error)
    })

    it('headers property is correctly set', () => {
        const client = new Client(shortcutApiKey)
        const expectedHeaders = {
            'Content-Type': contentType,
            'Shortcut-Token': shortcutApiKey
        }
        expect(client.headers).toEqual(expectedHeaders)
    })
})
