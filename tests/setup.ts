import process from 'process'


beforeEach(() => {
  jest.spyOn(console, 'log').mockImplementation(() => {
  })
  jest.spyOn(console, 'error').mockImplementation(() => {
  })
  jest.spyOn(console, 'warn').mockImplementation(() => {
  })
  process.env.SHORTCUT_API_KEY = 'token'
})

afterEach(() => {
  jest.restoreAllMocks()
})
