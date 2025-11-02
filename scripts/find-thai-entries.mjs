import fs from 'fs'
import path from 'path'

const readJson = (p) => JSON.parse(fs.readFileSync(path.resolve(p), 'utf8'))

const base = readJson('./assets/data/blueprints.json')
let fullEn = []
try { fullEn = readJson('./assets/data/blueprints.en.full.json') } catch(e) { }
const fullById = (fullEn || []).reduce((acc, b) => { if (b && b.id) acc[b.id] = b; return acc }, {})

// Thai Unicode range \u0E00-\u0E7F
const thaiRegex = /[\u0E00-\u0E7F]/

const problems = []
base.forEach(b => {
  const id = b.id
  const full = fullById[id] || {}
  const title = (full.title || b.title || '')
  const purpose = (full.purpose || b.purpose || b.description || '')
  const description = (full.description || b.description || '')
  const record = { id, titleHasThai: thaiRegex.test(String(title)), purposeHasThai: thaiRegex.test(String(purpose)), descriptionHasThai: thaiRegex.test(String(description)) }
  if (record.titleHasThai || record.purposeHasThai || record.descriptionHasThai) problems.push(record)
})

if (problems.length === 0) {
  console.log('No Thai text detected in base titles/purposes/descriptions (after applying fullEn overlay).')
} else {
  console.log('Entries with Thai in title/purpose/description (after overlay):')
  problems.forEach(p => console.log(`${p.id}: title:${p.titleHasThai ? 'TH' : '-'} purpose:${p.purposeHasThai ? 'TH' : '-'} description:${p.descriptionHasThai ? 'TH' : '-'}`))
  console.log(`\nTotal: ${problems.length} entries with Thai text.`)
}
