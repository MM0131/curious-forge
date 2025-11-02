/*
Auto-translate blueprints to English using Google Cloud Translate API (v2 REST).

Usage:
  1. Set GOOGLE_API_KEY in your environment (recommended) or pass as first arg.
     export GOOGLE_API_KEY=YOUR_KEY
     node ./scripts/auto-translate-blueprints.mjs

  2. The script will read `assets/data/blueprints.json`, translate the following
     fields for each blueprint to English: title, purpose, description, materials[], steps[], warnings.

  3. Output will be written to `assets/data/blueprints.en.full.json`.

Notes:
  - Google Translate API is a paid service. You will be charged for requests.
  - The script batches text requests to avoid exceeding URL length and to be efficient.
  - You can adapt the script to use DeepL by changing the endpoint and payload.
*/

import fs from 'fs'
import path from 'path'

const API_KEY = process.env.GOOGLE_API_KEY || process.argv[2]
if (!API_KEY) {
  console.error('Missing GOOGLE_API_KEY environment variable or CLI arg.');
  console.error('Set it and re-run: export GOOGLE_API_KEY=YOUR_KEY && node scripts/auto-translate-blueprints.mjs')
  process.exit(1)
}

const inPath = path.resolve(process.cwd(), 'assets', 'data', 'blueprints.json')
const outPath = path.resolve(process.cwd(), 'assets', 'data', 'blueprints.en.full.json')

const base = JSON.parse(fs.readFileSync(inPath, 'utf-8'))

// Helper to call Google Translate v2 for an array of strings. Returns array of translated strings.
async function translateBatch(texts, target = 'en') {
  // Build URL with key
  const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`

  // The API accepts multiple q fields in application/x-www-form-urlencoded or JSON; we'll POST JSON.
  const body = {
    q: texts,
    target,
    format: 'text'
  }

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const txt = await res.text()
    throw new Error(`Translate API error: ${res.status} ${res.statusText}: ${txt}`)
  }

  const data = await res.json()
  // data.data.translations is an array
  return data.data.translations.map(t => t.translatedText)
}

// Flatten all text pieces we want to translate into a list, remember mapping locations
const items = []
for (const b of base) {
  const entry = { id: b.id, fields: {} }
  // Collect singular fields
  entry.fields.title = b.title || ''
  entry.fields.purpose = b.purpose || ''
  entry.fields.description = b.description || ''
  entry.fields.warnings = b.warnings || ''
  // Collect arrays
  entry.fields.materials = Array.isArray(b.materials) ? b.materials.slice() : []
  entry.fields.steps = Array.isArray(b.steps) ? b.steps.slice() : []
  items.push(entry)
}

// Build a flat list of texts and a mapping back
const flat = []
const map = [] // {itemIndex, field, idx?}
for (let i = 0; i < items.length; i++) {
  const e = items[i]
  for (const f of ['title','purpose','description','warnings']) {
    flat.push(e.fields[f] || '')
    map.push({ i, field: f })
  }
  for (let j = 0; j < e.fields.materials.length; j++) {
    flat.push(e.fields.materials[j] || '')
    map.push({ i, field: 'materials', idx: j })
  }
  for (let j = 0; j < e.fields.steps.length; j++) {
    flat.push(e.fields.steps[j] || '')
    map.push({ i, field: 'steps', idx: j })
  }
}

// Batch size: send up to 100 q entries per request (Google supports many, but be conservative)
const BATCH = 90
const translated = new Array(flat.length)

async function run() {
  for (let s = 0; s < flat.length; s += BATCH) {
    const batch = flat.slice(s, s + BATCH)
    console.log(`Translating batch ${s}..${s+batch.length-1} (${batch.length} items)`)
    const out = await translateBatch(batch, 'en')
    for (let k = 0; k < out.length; k++) {
      translated[s + k] = out[k]
    }
    // small sleep to be polite
    await new Promise(r => setTimeout(r, 200))
  }

  // Put translations back into items
  for (let idx = 0; idx < map.length; idx++) {
    const m = map[idx]
    const val = translated[idx] || ''
    if (m.field === 'materials') {
      items[m.i].fields.materials[m.idx] = val
    } else if (m.field === 'steps') {
      items[m.i].fields.steps[m.idx] = val
    } else {
      items[m.i].fields[m.field] = val
    }
  }

  // Merge back into base copy producing full-English entries
  const outEntries = base.map(b => ({ ...b }))
  for (const e of items) {
    const idx = outEntries.findIndex(x => x.id === e.id)
    if (idx === -1) continue
    outEntries[idx].title = e.fields.title || outEntries[idx].title
    outEntries[idx].purpose = e.fields.purpose || outEntries[idx].purpose
    outEntries[idx].description = e.fields.description || outEntries[idx].description
    outEntries[idx].warnings = e.fields.warnings || outEntries[idx].warnings
    outEntries[idx].materials = e.fields.materials || outEntries[idx].materials
    outEntries[idx].steps = e.fields.steps || outEntries[idx].steps
  }

  fs.writeFileSync(outPath, JSON.stringify(outEntries, null, 2), 'utf-8')
  console.log('Wrote translated file to', outPath)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
