import fs from 'fs'
import path from 'path'
import {fileURLToPath} from 'url'


const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)


function appendJsExtension(file) {
  const content = fs.readFileSync(file, 'utf8')
  const updatedContent = content.replace(/require\(['"]([^'"]+)['"]\)/g, (match, p1) => {
    // Append .js to relative paths if missing and not already ending with .js or .json
    if (p1.startsWith('.') && !p1.endsWith('.js') && !p1.endsWith('.json')) {
      return `require('${p1}.cjs')`
    }
    return match
  })

  fs.writeFileSync(file, updatedContent, 'utf8')
}

function processDirectory(directory) {
  fs.readdirSync(directory, {withFileTypes: true}).forEach(dirent => {
    const fullPath = path.join(directory, dirent.name)
    if (dirent.isDirectory()) {
      processDirectory(fullPath)
    }
    else if (dirent.isFile() && dirent.name.endsWith('.cjs')) {
      appendJsExtension(fullPath)
    }
  })
}

// The directory containing your compiled JavaScript files.
// Adjust this path as necessary.
const compiledDir = path.join(dirname, '../dist/cjs')
processDirectory(compiledDir)

console.log('Import paths have been fixed for CJS modules.')
