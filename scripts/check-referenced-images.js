const fs = require('fs')
const path = require('path')

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'))
  } catch (e) {
    return null
  }
}

const root = path.join(__dirname, '..')
const assetsJson = path.join(root, 'assets', 'data', 'blueprints.json')
const fullJson = path.join(root, 'assets', 'data', 'blueprints.en.full.json')
const imagesDir = path.join(root, 'public', 'assets', 'images')

const base = readJson(assetsJson) || []
const full = readJson(fullJson) || []

const all = base.concat(full)

const referenced = new Set()
all.forEach(b => {
  if (b && b.image) referenced.add(b.image)
})

let present = []
try {
  present = fs.readdirSync(imagesDir)
} catch (e) {
  console.error('Failed to read images dir:', imagesDir, e.message)
  process.exit(2)
}

const missing = []
referenced.forEach(p => {
  const baseName = path.basename(p)
  if (!present.includes(baseName)) missing.push({ referenced: p, basename: baseName })
})

console.log('Referenced images count:', referenced.size)
if (missing.length === 0) {
  console.log('All referenced images are present in public/assets/images/')
  process.exit(0)
}

console.log('Missing images (referenced but not present):')
missing.forEach(m => console.log('-', m.referenced, '->', m.basename))
process.exit(1)
