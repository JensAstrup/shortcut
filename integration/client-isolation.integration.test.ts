import Client from '@sx/client'


/**
 * Guards the behaviour this branch exists to deliver (SAPI-326): a `Client` holds its credential on
 * its own axios instance instead of writing it to `process.env`.
 *
 * The unit suite asserts this against mocks. Only a real request proves the token actually travels
 * on the instance, since a mock will authenticate anything.
 */
describe('client credential isolation', () => {
  const originalKey = process.env.SHORTCUT_API_KEY

  afterEach(() => {
    if (originalKey === undefined) {
      delete process.env.SHORTCUT_API_KEY
    }
    else {
      process.env.SHORTCUT_API_KEY = originalKey
    }
  })

  it('does not write the constructor key into the environment', async () => {
    const apiKey = process.env.SHORTCUT_API_KEY
    if (!apiKey) {
      throw new Error('SHORTCUT_API_KEY must be set to run the integration suite')
    }
    delete process.env.SHORTCUT_API_KEY

    const client = new Client(apiKey)
    // A real call, so the assertion covers the token reaching the wire rather than just being stored.
    const workflows = await client.workflows.list()

    expect(workflows.length).toBeGreaterThan(0)
    expect(process.env.SHORTCUT_API_KEY).toBeUndefined()
  })

  it('keeps two clients independent', async () => {
    const apiKey = process.env.SHORTCUT_API_KEY!

    const valid = new Client(apiKey)
    const invalid = new Client('sct_invalid_token_for_integration_testing')

    // Constructing the second client must not disturb the first, which is exactly what the old
    // process.env write broke.
    await expect(invalid.workflows.list()).rejects.toThrow()
    const workflows = await valid.workflows.list()
    expect(workflows.length).toBeGreaterThan(0)
  })

  it('falls back to the environment when constructed with no key', async () => {
    const client = new Client()
    const workflows = await client.workflows.list()
    expect(workflows.length).toBeGreaterThan(0)
  })

  it('throws when no key is available anywhere', () => {
    delete process.env.SHORTCUT_API_KEY
    expect(() => new Client()).toThrow('Shortcut API Key not found')
  })
})
