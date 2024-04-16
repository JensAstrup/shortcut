// Convert imports to require statements:
const fs = require('fs')
const path = require('path')


function addJsExtension(file) {
  const content = fs.readFileSync(file, 'utf8')
  const updatedContent = content.replace(/from\s+['"]([^'"]+)['"]/g, (match, p1) => {
    // Don't modify node_modules imports or absolute paths or URLs
    if (p1.startsWith('.') && !p1.endsWith('.js') && !p1.endsWith('.json')) {
      return `from '${p1}.js'`
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
    else if (dirent.isFile() && dirent.name.endsWith('.js')) {
      addJsExtension(fullPath)
    }
  })
}

// The directory containing your compiled JavaScript files.
// Adjust this path as necessary.
let compiledDir = path.join(__dirname, '../dist/esm')
processDirectory(compiledDir)
compiledDir = path.join(__dirname, '../dist/cjs')
processDirectory(compiledDir)

console.log('Import paths have been fixed.')
