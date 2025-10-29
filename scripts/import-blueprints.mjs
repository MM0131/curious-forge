import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'
import fs from 'node:fs'
import path from 'node:path'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

const filePath = path.resolve('assets/data/blueprints.json')
const raw = fs.readFileSync(filePath, 'utf8')
const blueprints = JSON.parse(raw)

function mapToDb(row) {
  return {
    id: row.id, // keep stable ids
    title: row.title,
    description: row.description || row.purpose || '',
    category: row.category,
    difficulty: (() => {
      const d = (row.difficulty || '').toLowerCase()
      if (d.startsWith('easy')) return 'beginner'
      if (d.startsWith('medium')) return 'intermediate'
      if (d.startsWith('hard')) return 'advanced'
      return 'beginner'
    })(),
    duration: row.time || null,
    materials: row.materials || [],
    tools: [],
    steps: Array.isArray(row.steps)
      ? row.steps.map((s, i) => ({ number: i + 1, title: String(s) }))
      : [],
    science_explanation: row.sciencePrinciple || null,
    safety_notes: row.warnings ? [row.warnings] : [],
    image_url: row.image || null,
    video_url: row.videoUrl || null,
    status: 'published',
    views: 0,
    likes: 0
  }
}

async function main() {
  console.log(`Importing ${blueprints.length} blueprints...`)

  for (const bp of blueprints) {
    const dbRow = mapToDb(bp)
    const { error } = await supabase
      .from('blueprints')
      .upsert(dbRow, { onConflict: 'id' })
    if (error) {
      console.error('Failed to upsert', dbRow.id, error)
      process.exitCode = 1
    } else {
      console.log('Upserted', dbRow.id)
    }
  }

  console.log('Done')
}

await main()
