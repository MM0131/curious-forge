import fs from 'fs'
import path from 'path'

const readJson = (p) => JSON.parse(fs.readFileSync(path.resolve(p), 'utf8'))
const base = readJson('./assets/data/blueprints.json')
let fullEn = []
try { fullEn = readJson('./assets/data/blueprints.en.full.json') } catch(e) { }
const fullById = (fullEn || []).reduce((acc, b) => { if (b && b.id) acc[b.id] = b; return acc }, {})

// Read MANUAL_EN block from the TypeScript file and parse basic fields (title/purpose/description)
const ts = fs.readFileSync('./assets/data/blueprints.en.ts', 'utf8')
const manual = {}
const manMatch = ts.match(/const MANUAL_EN[\s\S]*?=\s*\{([\s\S]*?)\n\}\n\nfor \(const \[id, fields\] of Object\.entries\(MANUAL_EN\)/)
if (manMatch) {
  const block = manMatch[1]
  // find all entries like 'id': { ... }
  const entryRe = /['\"]([a-z0-9-_]+)['\"]\s*:\s*\{([\s\S]*?)\n\s*\}/g
  let m
  while ((m = entryRe.exec(block)) !== null) {
    const id = m[1]
    const body = m[2]
    const get = (k) => {
      const r = new RegExp(k + "\\s*:\\s*(['\"])\\s*([\\s\\S]*?)\\s*\\1")
      const mm = body.match(r)
      return mm ? mm[2].replace(/\\n/g, ' ').trim() : ''
    }
    manual[id] = { title: get('title'), purpose: get('purpose'), description: get('description') }
  }
}

const thaiRegex = /[\u0E00-\u0E7F]/

const problems = []
base.forEach(b => {
  const id = b.id
  const f = fullById[id] || {}
  const m = manual[id] || {}
  // final runtime precedence in the app: MANUAL_EN (manual) overlays onto any fullEn overlay.
  // So prefer manual overrides first, then fullEn, then base.
  const title = (m.title || f.title || b.title || '')
  const purpose = (m.purpose || f.purpose || b.purpose || b.description || '')
  const description = (m.description || f.description || b.description || '')
  const record = { id, titleHasThai: thaiRegex.test(String(title)), purposeHasThai: thaiRegex.test(String(purpose)), descriptionHasThai: thaiRegex.test(String(description)) }
  if (record.titleHasThai || record.purposeHasThai || record.descriptionHasThai) problems.push(record)
})

if (problems.length === 0) {
  console.log('No Thai text detected in titles/purposes/descriptions after applying fullEn and MANUAL_EN overlays.')
} else {
  console.log('Entries with Thai in title/purpose/description (after overlays):')
  problems.forEach(p => console.log(`${p.id}: title:${p.titleHasThai ? 'TH' : '-'} purpose:${p.purposeHasThai ? 'TH' : '-'} description:${p.descriptionHasThai ? 'TH' : '-'}`))
  console.log(`\nTotal: ${problems.length} entries with Thai text.`)
}
