/**
 * Config for the integration suite, kept separate from jest.config.js on purpose.
 *
 * The unit config sets a fake SHORTCUT_API_KEY and silences console in tests/setup.ts, both of which
 * would break or hide real API calls. It also collects coverage, which is meaningless here. Keeping
 * `roots` on ./integration means `yarn test` never picks these up and CI stays hermetic.
 *
 * @type {import('jest').Config}
 */
const config = {
  preset: 'ts-jest',
  moduleNameMapper: {
    '^@sx/(.*)$': '<rootDir>/src/$1'
  },
  roots: ['<rootDir>/integration'],
  testMatch: ['**/?(*.)+(integration.test).(js|ts)'],
  collectCoverage: false,
  // Real HTTP against a rate-limited API; the default 5s is not enough, and parallel workers make
  // both rate limiting and cross-test interference more likely.
  testTimeout: 30_000,
  maxWorkers: 1
}

export default config
