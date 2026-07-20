import { Command } from 'commander'
import { config } from 'dotenv'

import { createRelease } from './create-release'
import { prepareVersion } from './prepare-version'


config({ path: '.env.local' })

function isValidVersionType(type: string): boolean {
  return ['major', 'minor', 'patch'].includes(type)
}

function handleInvalidType(type: string): void {
  process.stderr.write(`Invalid version type: ${type}. Must be one of: major, minor, patch\n`)
  process.exit(1)
}

if (require.main === module) {
  const program = new Command()

  program
    .name('release-branch')
    .description('Commands for managing releases')
    .version('1.0.1')

  program
    .command('prepare-version [type]')
    .description('Create a version bump branch and PR to develop')
    .action((type: string | undefined) => {
      const versionType = type ?? 'patch'
      if (!isValidVersionType(versionType)) {
        handleInvalidType(versionType)
      }
      prepareVersion(versionType as 'major' | 'minor' | 'patch')
    })

  program
    .command('create-release')
    .description('Create a release branch and PR to main')
    .action(() => {
      createRelease()
    })

  program.parse()
}

export {
  prepareVersion,
  createRelease
}
