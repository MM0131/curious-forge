import { defineEventHandler, readBody } from 'h3'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const { title, description, category, difficulty, materials, submitter_name, submitter_email } = body

  // Basic validation
  if (!title || !description || !submitter_name || !submitter_email) {
    return {
      status: 400,
      error: 'Missing required fields'
    }
  }

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl
  const supabaseKey = config.public.supabaseKey

  if (!supabaseUrl || !supabaseKey) {
    return { status: 500, error: 'Supabase not configured on server' }
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey)

  // normalize materials into array
  let parsedMaterials: any[] = []
  if (Array.isArray(materials)) {
    parsedMaterials = materials
  } else if (typeof materials === 'string' && materials.trim()) {
    try {
      parsedMaterials = JSON.parse(materials)
      if (!Array.isArray(parsedMaterials)) parsedMaterials = [String(parsedMaterials)]
    } catch {
      // fallback: split by newline
  parsedMaterials = String(materials).split('\n').map((s: string) => s.trim()).filter(Boolean)
    }
  }

  const payload = {
    title,
    description,
    category: category || 'general',
    difficulty: (difficulty || 'beginner').toLowerCase(),
    materials: parsedMaterials,
    submitter_name,
    submitter_email,
    status: 'pending'
  }

  try {
    const { data, error } = await (supabase as any).from('submissions').insert([payload]).select().single()
    if (error) {
      return { status: 500, error: error.message }
    }
    return { status: 200, data }
  } catch (err: any) {
    return { status: 500, error: err?.message || 'Insert failed' }
  }
})
