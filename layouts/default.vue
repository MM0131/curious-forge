<template>
  <div class="min-h-screen flex flex-col text-slate-100">
    <OfflineBanner />
    <!-- Top bar -->
    <header class="w-full">
      <nav class="container mx-auto flex items-center justify-between py-6 px-4">
        <NuxtLink to="/" class="px-3 py-1 rounded-lg bg-violet-700/30 hover:bg-violet-600/40 transition">
          <span class="font-semibold tracking-wide">Curious Forge</span>
        </NuxtLink>

        <div class="flex items-center gap-6 text-sm">
          <NuxtLink class="hover:opacity-80" to="/">{{ translateOr('nav.home', 'Home') }}</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/library">{{ translateOr('nav.library', 'Library') }}</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/profile">{{ translateOr('nav.profile', 'Profile') }}</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/submit">{{ translateOr('nav.submit', 'Submit') }}</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/contact">{{ translateOr('nav.contact', 'Contact') }}</NuxtLink>
          
            <!-- Auth Button -->
            <div v-if="isAuthenticated" class="flex items-center gap-3">
              <span class="text-slate-400 text-xs">{{ user?.email }}</span>
              <button 
                @click="handleSignOut"
                class="px-3 py-1.5 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg text-xs transition"
              >
                {{ translateOr('auth.signOut', 'Sign out') }}
              </button>
            </div>
            <NuxtLink 
              v-else
              to="/login" 
              class="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-lg text-xs font-semibold transition"
            >
              {{ translateOr('auth.signIn', 'Sign in') }}
            </NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Page body -->
    <main class="flex-1 container mx-auto px-4">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div class="container mx-auto px-4 py-6 flex items-center justify-between text-slate-300 text-sm">
        <div>{{ translateOr('footer.copyright', '© Curious Forge') }}</div>
        <div class="flex gap-6">
          <NuxtLink class="hover:opacity-80" to="/about">{{ translateOr('footer.about', 'About') }}</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/contact">{{ translateOr('footer.contact', 'Contact') }}</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import OfflineBanner from '~/components/OfflineBanner.client.vue'

const { t } = useI18n()
// Helper: return translation if available, otherwise a readable fallback
const translateOr = (key: string, fallback: string) => {
  const v = t(key)
  return v === key ? fallback : v
}
const { user, isAuthenticated, signOut } = useAuth()
const router = useRouter()

const handleSignOut = async () => {
  await signOut()
  router.push('/')
}
</script>
