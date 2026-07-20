import { readFile } from 'fs/promises'
import { resolve } from 'path'


interface PackageJson {
  version: string
}

/**
 * Gets the current version from package.json
 */
async function getNewVersion(): Promise<string> {
  try {
    const packagePath = resolve(process.cwd(), 'package.json')
    const packageJson = JSON.parse(await readFile(packagePath, 'utf-8')) as PackageJson
    if (!packageJson.version) {
      throw new Error('No version found in package.json')
    }
    return packageJson.version
  }
  catch (error) {
    throw new Error(`Failed to get version from package.json: ${error instanceof Error ? error.message : String(error)}`)
  }
}

export { getNewVersion }
