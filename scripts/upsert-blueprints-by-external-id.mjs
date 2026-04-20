#!/usr/bin/env node
/**
 * scripts/upsert-blueprints-by-external-id.mjs
 *
 * Upserts blueprint rows into Supabase by `external_id` (from dataset entry.id).
 * Requires SUPABASE_URL and SUPABASE_SERVICE_KEY in environment.
 * Uses Supabase REST endpoint with `on_conflict=external_id` to perform upsert.
 */

import fs from 'fs'
import path from 'path'

// Use global fetch when available (Node 18+), otherwise dynamically import node-fetch
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
  console.error('SUPABASE_SERVICE_KEY not set. This script requires a service role key to upsert.')
  process.exit(1)
}

const dataDir = path.resolve(process.cwd(), 'assets', 'data')
const fullJson = path.join(dataDir, 'blueprints.en.full.json')
const fallbackJson = path.join(dataDir, 'blueprints.json')

let dataset
if (fs.existsSync(fullJson)) dataset = JSON.parse(fs.readFileSync(fullJson, 'utf8'))
else if (fs.existsSync(fallbackJson)) dataset = JSON.parse(fs.readFileSync(fallbackJson, 'utf8'))
else {
  console.error('No dataset found in assets/data (expected blueprints.en.full.json or blueprints.json)')
  process.exit(1)
}

const normalizeSlug = (s) => {
  if (!s) return ''
  return String(s)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

const restPost = (endpoint, body, opts = {}) => {
  const url = `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${endpoint}${opts.query || ''}`
  const headers = {
    apikey: ANON_KEY || SERVICE_KEY,
    Authorization: `Bearer ${SERVICE_KEY}`,
    'Content-Type': 'application/json',
    Prefer: opts.prefer || 'return=representation'
  }
  return fetch(url, { method: opts.method || 'POST', headers, body: JSON.stringify(body) })
}

const run = async () => {
  console.log('Dataset entries:', dataset.length)
  let count = 0
  for (const entry of dataset) {
    const externalId = entry.id || normalizeSlug(entry.title || '')
    if (!externalId) continue

    const slug = normalizeSlug(externalId || entry.title || '') || undefined
    const title = entry.title || entry.title_en || externalId
    const description = entry.description || entry.description_en || ''
    const category = entry.category || entry.group || 'general'
    const difficulty = entry.difficulty || 'beginner'
    const image_url = entry.image || entry.image_url || null
    const materials = Array.isArray(entry.materials) ? entry.materials : []
    const steps = Array.isArray(entry.steps) ? entry.steps : []

    const payload = {
      external_id: externalId,
      slug,
      title,
      description,
      category,
      difficulty,
      image_url,
      materials,
      steps,
      status: 'published'
    }

    try {
      // Use on_conflict=external_id to upsert
      const q = '?on_conflict=external_id'
      const resp = await restPost('blueprints' + q, [payload], { prefer: 'return=representation' })
      if (!resp.ok) {
        const text = await resp.text().catch(() => '')
        console.error('Upsert failed for', externalId, resp.status, text)
        continue
      }
      const json = await resp.json().catch(() => null)
      console.log('Upserted', externalId, '->', json && json[0] && json[0].id)
      count++
    } catch (err) {
      console.error('Error upserting', externalId, err)
    }
  }
  console.log(`Done. Upserted ${count} entries.`)
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})
