export function isSupabaseConfigured() {
  const config = useRuntimeConfig()
  const url = (config.public as any)?.supabaseUrl as string | undefined
  const key = (config.public as any)?.supabaseKey as string | undefined
  return Boolean(url && key)
}
