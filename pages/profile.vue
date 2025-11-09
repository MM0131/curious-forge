<template>
  <section class="py-14">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <div>
          <h1 class="text-3xl font-extrabold">My Profile</h1>
          <p class="text-slate-400 mt-1">Manage your projects and activity</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- Left column: stats + quick actions -->
        <div class="space-y-6">
          <div class="grid grid-cols-1 gap-4">
            <StatCard :value="viewCount" label="Views" />
            <StatCard :value="savedCount" label="Saved" />
            <StatCard :value="contributeCount" label="Contributed" />
          </div>

          <div class="card">
            <h3 class="font-semibold mb-3">Quick actions</h3>
            <div class="space-y-3">
              <NuxtLink to="/library" class="btn-primary w-full inline-flex items-center justify-center gap-2">
                Browse Library
              </NuxtLink>
              <NuxtLink to="/submit" class="btn-ghost w-full inline-flex items-center justify-center gap-2">
                Submit an idea
              </NuxtLink>
              <button class="btn-ghost w-full inline-flex items-center justify-center gap-2 opacity-80" @click="clearNotifications">
                Clear notifications
              </button>
            </div>
          </div>
        </div>

        <!-- Right columns: saved projects (span 2 columns) -->
        <div class="md:col-span-2">
          <h2 class="mt-0 text-xl font-semibold">Saved projects</h2>

          <ClientOnly>
            <div v-if="savedBlueprints.length === 0" class="mt-6 card text-center py-12">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-slate-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <p class="text-slate-400 text-lg mb-2">You have no saved projects</p>
              <p class="text-slate-500 text-sm mb-4">Add projects you like from the library to keep them here.</p>
              <NuxtLink to="/library" class="btn-primary inline-flex items-center gap-2">
                Browse Library
              </NuxtLink>
            </div>

            <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="bp in savedBlueprints" :key="bp.id" class="relative group">
                <!-- Green "Saved" badge shown on saved items -->
                <span class="absolute top-3 left-3 z-20 px-2 py-1 text-xs font-semibold rounded-full bg-emerald-600 text-emerald-100 border border-emerald-500/40">Saved</span>
                <NuxtLink :to="`/blueprints/${bp.id}`" class="block">
                  <div class="card hover:bg-white/7 transition">
                    <img v-if="bp.image" :src="bp.image" :alt="bp.title" class="w-full h-44 object-cover rounded-xl mb-4" />
                    <h3 class="text-lg font-semibold leading-snug">{{ bp.title }}</h3>
                    <p class="mt-1 text-sm text-slate-300 line-clamp-2">{{ bp.purpose }}</p>

                    <div class="mt-4 flex items-center gap-3 text-xs text-slate-300">
                      <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ bp.time || '—' }}</span>
                      <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ (bp.materials?.length || 0) }} materials</span>
                      <span class="px-2 py-1 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-200">{{ bp.difficulty || 'Unknown' }}</span>
                    </div>
                  </div>
                </NuxtLink>
                <button
                  class="absolute top-3 right-3 z-10 px-3 py-1.5 text-xs rounded-lg bg-rose-600/80 hover:bg-rose-600 border border-rose-500/50 transition-all opacity-0 group-hover:opacity-100"
                  aria-label="Remove from saved"
                  @click.prevent="removeSaved(bp.id)"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                  Remove
                </button>
              </div>
            </div>
          </ClientOnly>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import StatCard from '~/components/StatCard.vue'
import { useSaved } from '~/composables/useSaved'
import { useBlueprints } from '~/composables/useBlueprints'
import blueprintsData from '@/assets/data/blueprints.en'
import { onMounted, computed } from 'vue'

const { load, list: loadedList } = useBlueprints()
const { savedIds, count: savedCount, remove, loadSaved } = useSaved()

// Map saved ids to blueprint objects immediately (robust to load timing)
const savedBlueprints = computed(() => {
  const all = (loadedList?.value && loadedList.value.length > 0)
    ? loadedList.value
    : (blueprintsData as any)
  return savedIds.value.map(id => all.find((b: any) => b.id === id)).filter(Boolean)
})

// ยังไม่มีการเก็บสถิติจริงสำหรับ 2 ค่าแรก/สุดท้าย จึงใส่ 0 ไว้ก่อน
const viewCount = 0
const contributeCount = 0

function removeSaved(id: string) {
  remove(id)
}

function clearNotifications() {
  // Placeholder: hook into real notification clearing when available
  // eslint-disable-next-line no-console
  console.log('clearNotifications called')
}

onMounted(async () => {
  // Ensure both blueprints and saved ids are loaded so saved list maps reliably
  try {
    await Promise.all([load(), loadSaved()])
  } catch (e) {
    // swallow – UI will fallback to local dataset
    // eslint-disable-next-line no-console
    console.error('Profile load error', e)
  }
})
</script>
