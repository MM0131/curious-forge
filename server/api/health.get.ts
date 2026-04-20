import { defineEventHandler } from 'h3'

export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  const supabaseConfigured = Boolean((config.public as any).supabaseUrl && (config.public as any).supabaseKey)

  return {
    status: 'ok',
    time: new Date().toISOString(),
    uptime: process.uptime(),
    supabaseConfigured
  }
})
