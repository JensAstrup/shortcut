import process from 'process'


const originalEnv = {...process.env}

beforeAll(() => {
  process.env.SHORTCUT_API_KEY = 'token'
})

beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {
  })
  jest.spyOn(console, 'error').mockImplementation(() => {
  })
  jest.spyOn(console, 'warn').mockImplementation(() => {
  })
})

afterEach(() => {
  jest.restoreAllMocks()
})

afterAll(() => {
  process.env = originalEnv
})
