#!/usr/bin/env node
/**
 * scripts/import-slugs.mjs
 *
 * Reads the canonical dataset in `assets/data` and updates the `slug` column on
 * `blueprints` in your Supabase database by matching on title when possible.
 *
 * Usage:
 *   SUPABASE_URL=... SUPABASE_SERVICE_KEY=... node scripts/import-slugs.mjs
 *
 * Notes:
 * - This script prefers `assets/data/blueprints.en.full.json` if present, otherwise
 *   falls back to `assets/data/blueprints.json`.
 * - It attempts exact title match first, then a normalized-title match. If no DB row
 *   is found for an entry, it will report a warning.
 */

import fs from 'fs'
import path from 'path'
// Prefer global fetch when available (Node 18+). Otherwise try to import node-fetch.
let fetchLib
if (typeof globalThis.fetch === 'function') {
  fetchLib = globalThis.fetch.bind(globalThis)
} else {
  try {
    const mod = await import('node-fetch')
    fetchLib = mod.default
  } catch (e) {
    console.error('Global fetch not available and node-fetch is not installed. Please run `npm install node-fetch` or use Node 18+.')
    process.exit(1)
  }
}

const fetch = fetchLib

const SUPABASE_URL = process.env.SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
const ANON_KEY = process.env.SUPABASE_KEY

if (!SUPABASE_URL) {
  console.error('SUPABASE_URL not set. Set it in environment or .env before running this script.')
  process.exit(1)
}

if (!SERVICE_KEY) {
  console.error('SUPABASE_SERVICE_KEY not set. For safety this script requires a service role key.')
  process.exit(1)
}

const baseDir = path.resolve(process.cwd(), 'assets', 'data')
const fullJson = path.join(baseDir, 'blueprints.en.full.json')
const fallbackJson = path.join(baseDir, 'blueprints.json')

let data = null
if (fs.existsSync(fullJson)) {
  data = JSON.parse(fs.readFileSync(fullJson, 'utf8'))
} else if (fs.existsSync(fallbackJson)) {
  data = JSON.parse(fs.readFileSync(fallbackJson, 'utf8'))
} else {
  console.error('No blueprint dataset found in assets/data (expected blueprints.en.full.json or blueprints.json)')
  process.exit(1)
}

// Normalize function similar to migrations
const normalizeSlug = (s) => {
  if (!s) return ''
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const supabaseRest = (endpoint, opts = {}) => {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${endpoint}`
  const headers = Object.assign({
    apikey: ANON_KEY || SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json'
  }, opts.headers || {})
  return fetch(url + (opts.query || ''), Object.assign({}, opts, { headers }))
}

const run = async () => {
  console.log('Found dataset entries:', data.length)
  let updated = 0
  for (const entry of data) {
    const entryId = entry.id || normalizeSlug(entry.title || '')
    const slug = normalizeSlug(entryId)
    const title = entry.title || entry.title_en || ''

    if (!slug) {
      console.warn('Skipping entry with no id/title:', entry)
      continue
    }

    // Try exact title match first (case-sensitive can vary); then normalized-title match
    let found = null

    // 1) exact title
    if (title) {
      const q1 = `?select=id,title&title=eq.${encodeURIComponent(title)}&limit=1`
      const r1 = await supabaseRest('blueprints', { method: 'GET', query: q1 })
      if (r1.ok) {
        const j1 = await r1.json()
        if (Array.isArray(j1) && j1.length > 0) found = j1[0]
      }
    }

    // 2) normalized title match
    if (!found && title) {
      const norm = normalizeSlug(title)
      const q2 = `?select=id,title&limit=5`
      const r2 = await supabaseRest('blueprints', { method: 'GET', query: q2 })
      if (r2.ok) {
        const j2 = await r2.json()
        if (Array.isArray(j2)) {
          const cand = j2.find(c => normalizeSlug(c.title || '') === norm)
          if (cand) found = cand
        }
      }
    }

    // 3) fallback: try to match slug-shaped id in title or image or id keywords
    if (!found) {
      const q3 = `?select=id,title,slug&limit=100`
      const r3 = await supabaseRest('blueprints', { method: 'GET', query: q3 })
      if (r3.ok) {
        const j3 = await r3.json()
        if (Array.isArray(j3)) {
          const cand = j3.find(c => (c.slug && normalizeSlug(c.slug) === slug) || (c.title && normalizeSlug(c.title) === slug))
          if (cand) found = cand
        }
      }
    }

    if (!found) {
      console.warn(`No matching DB row found for dataset id=${entryId} title="${title}" -- skipping`)
      continue
    }

    // Update found row with slug
    try {
      const updateResp = await supabaseRest(`blueprints?id=eq.${found.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ slug }),
        query: ''
      })
      if (!updateResp.ok) {
        const body = await updateResp.text()
        console.error(`Failed to update blueprint ${found.id}:`, updateResp.status, body)
        continue
      }
      console.log(`Updated blueprint id=${found.id} slug=${slug}`)
      updated++
    } catch (err) {
      console.error('Update error', err)
    }
  }

  console.log(`Done. Updated ${updated} entries.`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
