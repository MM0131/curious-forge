import fs from 'fs'
import path from 'path'

const basePath = path.resolve(process.cwd(), 'assets', 'data', 'blueprints.json')
const outPath = path.resolve(process.cwd(), 'scripts', 'blueprints-to-translate.json')

const data = JSON.parse(fs.readFileSync(basePath, 'utf-8'))

const exportItems = data.map(b => ({
  id: b.id,
  title: b.title || '',
  purpose: b.purpose || '',
  description: b.description || '',
  materials: Array.isArray(b.materials) ? b.materials : [],
  steps: Array.isArray(b.steps) ? b.steps : [],
  warnings: b.warnings || ''
}))

fs.writeFileSync(outPath, JSON.stringify(exportItems, null, 2), 'utf-8')
console.log('Wrote', outPath)
