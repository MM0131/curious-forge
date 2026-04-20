import { defineEventHandler, readBody, getHeader } from 'h3'
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
  // Prefer a server-only service key for writes; if missing, allow authenticated user's token path
  const supabaseServiceKey = (config as any).supabaseServiceKey as string | undefined
  const publicAnonKey = config.public.supabaseKey as string | undefined

  if (!supabaseUrl) {
    return { status: 500, error: 'Supabase URL not configured on server' }
  }

  // Read Authorization header if provided
  const authHeader = getHeader(event, 'authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '').trim() || null

  // Helper: respond with instruction when service key is missing and no token supplied
  const requireLoginResponse = {
    status: 401,
    error: 'Server requires either a valid Supabase service key (SUPABASE_SERVICE_KEY) or a user access token. Please sign in and submit from the client or configure a service key on the server.'
  }

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
    // If service key is present and looks valid, use admin client to insert (server-side)
    if (supabaseServiceKey && !/paste|your-service-role-key|replace/i.test(supabaseServiceKey)) {
      const admin = createClient<Database>(supabaseUrl, supabaseServiceKey)
      const { data, error } = await (admin as any).from('submissions').insert([payload]).select().single()
      if (error) return { status: 500, error: error.message }
      return { status: 200, data }
    }

    // No service key: require a user token and verify it via Supabase auth endpoint
    if (!token) {
      return requireLoginResponse
    }

    // Verify token by calling Supabase auth REST endpoint (/auth/v1/user)
    const userResp = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: publicAnonKey || ''
      }
    })

    if (!userResp.ok) {
      return { status: 401, error: 'Invalid or expired user token' }
    }

    // Token valid: forward insert to Supabase REST API as that user so RLS can apply
    const restUrl = `${supabaseUrl.replace(/\/$/, '')}/rest/v1/submissions`
    const restResp = await fetch(restUrl + `?select=*`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: publicAnonKey || '',
        'Content-Type': 'application/json',
        Prefer: 'return=representation'
      },
      body: JSON.stringify([payload])
    })

    const restJson = await restResp.json().catch(() => null)
    if (!restResp.ok) {
      // forward error message if present
      const errMsg = restJson && (restJson.message || restJson.error_description || restJson.error) ?
        (restJson.message || restJson.error_description || restJson.error) : 'Insert failed (user request)'
      return { status: restResp.status === 401 ? 401 : 500, error: errMsg }
    }

    // Success: restJson should be an array with inserted record(s)
    return { status: 200, data: Array.isArray(restJson) ? restJson[0] : restJson }
  } catch (err: any) {
    return { status: 500, error: err?.message || 'Insert failed' }
  }
})
