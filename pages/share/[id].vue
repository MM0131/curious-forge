<template>
  <div class="min-h-screen flex items-center justify-center text-slate-100 p-6">
    <div class="max-w-2xl w-full text-center">
      <h1 class="text-2xl font-bold mb-2">Opening shared project…</h1>
      <p class="text-slate-300 mb-6">This link was shared with you. You will be redirected to the original project shortly.</p>
      <div v-if="error" class="p-3 bg-red-600/10 border border-red-600 rounded mb-4 text-red-300">{{ error }}</div>
      <div v-if="bpUrl" class="space-y-3">
        <a :href="bpUrl" class="btn-primary">Open project</a>
        <button @click="notifyOwner" v-if="canNotify" class="btn-primary bg-white/6">Notify owner</button>
      </div>
      <div v-else class="text-slate-400">Loading…</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSupabase } from '~/composables/useSupabase'
import { useAuth } from '~/composables/useAuth'

const route = useRoute()
const router = useRouter()
const id = Array.isArray(route.params.id) ? route.params.id[0] : String(route.params.id)

const supabaseConfigured = Boolean(useRuntimeConfig().public?.supabaseUrl && useRuntimeConfig().public?.supabaseKey)
const supabase = supabaseConfigured ? useSupabase() : null
const { user } = useAuth()

const bpUrl = ref<string | null>(null)
const error = ref('')
const canNotify = ref(false)

// Record a view for this share; redirect to blueprint URL when done
onMounted(async () => {
  if (!supabase) {
    // if no Supabase, we can't record a view — just try to load a direct mapping from shareId to blueprint
    // But we don't have persistence, so redirect to home
    router.push('/')
    return
  }

  try {
    // fetch share record
    const res = await (supabase as any).from('shares').select('*').eq('id', id).single()
    const share = (res as any).data
    const e = (res as any).error
    if (e || !share) {
      error.value = 'Shared link not found or has expired.'
      return
    }

    // record a view in share_views table
    const viewer = {
      share_id: id,
      viewer_id: (user && (user as any).id) || null,
      viewer_user_agent: (globalThis.navigator && globalThis.navigator.userAgent) || null
    }
    await (supabase as any).from('share_views').insert(viewer as any)

    // redirect to blueprint url (if the original url included the blueprint path, use it)
  const original = (share as any).url as string
    bpUrl.value = original

    // mark if we can send a manual notification (allow viewer to notify owner)
  canNotify.value = !!(share as any).owner_id

    // give a moment for user to click Notify if desired then redirect
    setTimeout(() => {
      if (bpUrl.value) window.location.href = bpUrl.value
    }, 850)
  } catch (err: any) {
    console.error(err)
    error.value = err.message || String(err)
  }
})

// If visitor clicks notify, insert an explicit notification record
const notifyOwner = async () => {
  if (!supabase) return
  try {
  await (supabase as any).from('share_notifications').insert({ share_id: id, notifier_id: (user && (user as any).id) || null, message: 'Visitor requested your attention' } as any)
    alert('Owner has been notified (if they are listening).')
  } catch (err: any) {
    console.error(err)
    alert('Failed to send notification')
  }
}
</script>

<style scoped>
.btn-primary { display: inline-block; padding: 0.6rem 1rem; border-radius: 0.5rem; background: linear-gradient(90deg,#7c3aed,#ec4899); color: white; font-weight: 600; }
</style>
