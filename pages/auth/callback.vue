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

onMounted(async () => {
  // Wait a bit for auth state to update
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Redirect to home or original destination
  const redirect = route.query.redirect as string || '/'
  router.push(redirect)
})
</script>
