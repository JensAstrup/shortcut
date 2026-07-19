import AxiosMockAdapter from 'axios-mock-adapter'

import Client from '../src/client'


describe('Client', () => {
  const shortcutApiKey = 'fakekey'

  beforeEach(() => {
    process.env.SHORTCUT_API_KEY = 'fakeEnvKey'
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  /** The client is private by design; tests reach in to bind a mock adapter to it. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const adapterFor = (client: Client): AxiosMockAdapter => new AxiosMockAdapter((client as any).http)

  it('authenticates requests with the key passed to the constructor', async () => {
    const client = new Client(shortcutApiKey)
    const mock = adapterFor(client)
    mock.onGet('/stories/1').reply(200, {id: 1})

    await client.stories.get(1)

    expect(mock.history.get[0].headers?.['Shortcut-Token']).toEqual(shortcutApiKey)
  })

  it('falls back to the SHORTCUT_API_KEY environment variable', async () => {
    const client = new Client()
    const mock = adapterFor(client)
    mock.onGet('/stories/1').reply(200, {id: 1})

    await client.stories.get(1)

    expect(mock.history.get[0].headers?.['Shortcut-Token']).toEqual('fakeEnvKey')
  })

  it('throws an error when shortcutApiKey and SHORTCUT_API_KEY are not defined', () => {
    process.env.SHORTCUT_API_KEY = ''
    expect(() => new Client()).toThrow('Shortcut API Key not found')
  })

  it('does not write the API key into the environment', () => {
    new Client(shortcutApiKey)

    expect(process.env.SHORTCUT_API_KEY).toEqual('fakeEnvKey')
  })

  it('keeps two clients with different keys isolated', async () => {
    const clientA = new Client('key-a')
    const mockA = adapterFor(clientA)
    mockA.onGet('/stories/1').reply(200, {id: 1})
    mockA.onPut('/stories/1').reply(200, {id: 1, name: 'updated'})

    const story = await clientA.stories.get(1)

    // Constructing a second client must not retroactively change how client A's resources authenticate.
    const clientB = new Client('key-b')
    adapterFor(clientB)

    story.name = 'updated'
    await story.update()

    expect(mockA.history.put).toHaveLength(1)
    expect(mockA.history.put[0].headers?.['Shortcut-Token']).toEqual('key-a')
  })
})
