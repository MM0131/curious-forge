import { defineEventHandler, readBody, getHeader } from 'h3'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id as string
  const body = await readBody(event) as { status?: string }
  const status = body.status

  if (!id || !status) return { status: 400, error: 'Missing id or status' }

  const authHeader = getHeader(event, 'authorization') || ''
  const token = authHeader.replace(/^Bearer\s+/i, '')
  if (!token) return { status: 401, error: 'Missing Authorization token' }

  const SUPABASE_URL = process.env.SUPABASE_URL
  const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { status: 500, error: 'Service key not configured' }

  const admin = createClient<Database>(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Verify token belongs to an admin user
  try {
    const { data: userResp, error: userErr } = await admin.auth.getUser(token)
    if (userErr) return { status: 401, error: 'Invalid token' }
    const user = (userResp as any)?.user
    if (!user || !user.email || !user.email.endsWith('@admin.curiousforge.com')) {
      return { status: 403, error: 'Forbidden' }
    }
  } catch {
    return { status: 401, error: 'Failed to verify token' }
  }

  // Update submission status
  const { data, error } = await (admin as any).from('submissions').update({ status } as any).eq('id', id).select().single()
  if (error) return { status: 500, error: error.message }
  return { status: 200, data }
})
