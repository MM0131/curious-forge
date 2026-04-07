<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
    <div class="text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
      <p class="text-white text-lg">{{ $t('auth.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// OAuth callback handler
const router = useRouter()
const route = useRoute()
const config = useRuntimeConfig()

const getRedirectTarget = () => {
  const nextFromQuery = route.query.next

  if (typeof nextFromQuery !== 'string' || !nextFromQuery.startsWith('/')) {
    return '/'
  }

  return nextFromQuery
}

onMounted(async () => {
  try {
    const providerError = route.query.error
    if (typeof providerError === 'string') {
      const code = providerError === 'access_denied' ? 'oauth_access_denied' : 'oauth_callback_failed'
      return router.replace(`/login?error=${encodeURIComponent(code)}`)
    }

    if (!(config.public as any).supabaseUrl || !(config.public as any).supabaseKey) {
      return router.replace('/login?error=supabase_not_configured')
    }

    const supabase = useSupabase()
    const hashParams = new URLSearchParams(globalThis.location.hash.replace(/^#/, ''))
    const hasHashSession = hashParams.has('access_token')
    const authCode = route.query.code

    if (typeof authCode === 'string') {
      const { error } = await supabase.auth.exchangeCodeForSession(authCode)
      if (error) throw error
    }

    if (!hasHashSession) {
      const { data, error } = await supabase.auth.getSession()
      if (error) throw error

      if (!data.session) {
        return router.replace('/login?error=oauth_callback_failed')
      }
    }

    return router.replace(getRedirectTarget())
  } catch (error) {
    return router.replace('/login?error=oauth_callback_failed')
  }
})
</script>
