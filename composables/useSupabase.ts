import { createClient } from '@supabase/supabase-js'
import type { Database } from '~/types/database'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase URL or Key is missing. Please check your .env file.')
  }

  const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })

  return supabase
}
