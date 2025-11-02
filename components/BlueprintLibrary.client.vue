<template>
  <section class="py-14">
    <h1 class="text-3xl font-extrabold mb-8">Blueprint Library</h1>

    <!-- Search & Filter Section -->
    <div class="mb-10 space-y-4">
      <!-- Search Bar -->
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        <input
          v-model="q"
          type="text"
          placeholder="🔍 Search projects — e.g. volcano, battery, camera..."
          class="w-full rounded-xl bg-white/5 border border-white/10 pl-12 pr-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
        />
        <button
          v-if="q"
          @click="q = ''"
          class="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-white transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Filters Row -->
      <div class="grid md:grid-cols-3 gap-4">
        <!-- Category Filter -->
        <select
          v-model="cat"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="">📚 All categories</option>
          <option value="Chemistry">🧪 Chemistry</option>
          <option value="Physics">⚛️ Physics</option>
          <option value="Biology">🧬 Biology</option>
          <option value="Energy">⚡ Energy</option>
          <option value="Geology">🌍 Geology</option>
          <option value="Engineering">⚙️ Engineering</option>
        </select>

        <!-- Difficulty Filter -->
        <select
          v-model="difficulty"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="">🎯 All difficulty levels</option>
          <option value="Easy">😊 Easy</option>
          <option value="Medium">🤔 Medium</option>
          <option value="Hard">🔥 Hard</option>
        </select>

        <!-- Sort Options -->
        <select
          v-model="sortBy"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="default">🔤 Sort: Name (A–Z)</option>
          <option value="timeAsc">⏱️ Time: short → long</option>
          <option value="timeDesc">⏱️ Time: long → short</option>
          <option value="difficultyAsc">📈 Difficulty: easy → hard</option>
          <option value="difficultyDesc">📉 Difficulty: hard → easy</option>
        </select>
      </div>

      <!-- Results Summary -->
      <div class="flex items-center justify-between text-sm text-slate-400">
        <p>
          <span class="text-violet-400 font-semibold">{{ filteredBlueprints.length }}</span> projects
          <span v-if="q || cat || difficulty"> (filtered)</span>
        </p>
          <button
          v-if="q || cat || difficulty || sortBy !== 'default'"
          @click="resetFilters"
          class="text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          Reset filters
        </button>
      </div>
    </div>

    <div v-if="filteredBlueprints.length === 0" class="text-center py-12">
      <p class="text-xl text-slate-400">No blueprints found</p>
    </div>

    <div v-else>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="bp in pagedBlueprints"
          :key="bp.id"
          class="relative"
        >
        <button
          class="absolute top-3 right-3 z-10 rounded-lg border border-white/10 bg-black/30 backdrop-blur px-2 py-1 text-xs hover:bg-black/50"
          @click.stop="onToggle(bp.id)"
          :aria-pressed="isSaved(bp.id)"
          :title="isSaved(bp.id) ? 'Remove from saved' : 'Save project'"
        >
          {{ isSaved(bp.id) ? 'Saved' : 'Save' }}
        </button>

        <!-- Use the reusable BlueprintCard component for consistent layout -->
        <BlueprintCard
          :title="englishTitle(bp.title)"
          :subtitle="englishPurpose(bp.purpose)"
          :time="bp.time || '—'"
          :people="(bp.materials?.length || 0) + ' materials'"
          :level="bp.difficulty || 'Unknown'"
          :cover="imageFor(bp)"
          :to="`/blueprints/${bp.id}`"
        />
      </div>
      </div>

      <!-- Pagination controls -->
      <div class="mt-8 flex items-center justify-between">
        <div class="text-sm text-slate-400">Showing <span class="font-semibold text-slate-200">{{ startItem }}–{{ endItem }}</span> of <span class="font-semibold text-violet-400">{{ filteredBlueprints.length }}</span></div>
        <div class="flex items-center gap-2">
          <button class="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10" :disabled="page === 1" @click="prevPage">Prev</button>
          <div class="text-sm text-slate-300">Page <span class="font-mono px-2">{{ page }}</span> of {{ totalPages }}</div>
          <button class="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10" :disabled="page === totalPages" @click="nextPage">Next</button>
        </div>
      </div>
    </div>

    <div v-if="isDev" class="fixed bottom-4 right-4 z-50 text-xs bg-black/60 backdrop-blur border border-white/10 rounded-lg px-3 py-2 space-y-1">
      <div>q: <span class="font-mono">{{ q }}</span></div>
      <div>cat: <span class="font-mono">{{ cat }}</span></div>
      <div>count: <span class="font-mono">{{ filteredBlueprints.length }}</span></div>
      <div class="pt-1 flex items-center gap-2">
        <button @click="n++" class="px-2 py-1 rounded bg-white/10 hover:bg-white/20">debug +1</button>
        <span class="font-mono">n: {{ n }}</span>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import BlueprintCard from '~/components/BlueprintCard.vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.en'
import { useSaved } from '~/composables/useSaved'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const isDev = import.meta.env.DEV
const q = ref('')
const cat = ref('')
const difficulty = ref('')
const sortBy = ref('default')
const n = ref(0)

// Pagination
const page = ref(1)
const pageSize = ref(6) // 3 cols x 2 rows per page to avoid overflowing frame

const allBlueprints = blueprintsData as Blueprint[]

// Helpers to prefer English names/purposes when present in parentheses
const englishTitle = (title?: string) => {
  if (!title) return ''
  const m = title.match(/\(([^)]+)\)/)
  if (m && m[1]) return m[1].trim()
  return title
}

const englishPurpose = (purpose?: string) => {
  if (!purpose) return ''
  const m = purpose.match(/\(([^)]+)\)/)
  if (m && m[1]) return m[1].trim()
  const ascii = purpose.match(/[A-Za-z0-9 ,.'"-]{4,}/)
  if (ascii) return ascii[0].trim()
  return purpose
}

// saved state
const { isSaved, toggle } = useSaved()
const { isAuthenticated } = useAuth()
const router = useRouter()

async function onToggle(id: string) {
  if (!isAuthenticated.value) {
    const path = `/login?redirect=${encodeURIComponent('/library')}`
    router.push(path)
    return
  }
  await toggle(id)
}

const filteredBlueprints = computed<Blueprint[]>(() => {
  const query = q.value.trim().toLowerCase()
  const category = cat.value.trim().toLowerCase()
  const diff = difficulty.value.trim()

  let result = [...allBlueprints]

  // Filter by search query
  if (query) {
    result = result.filter(bp =>
      (bp.title || '').toLowerCase().includes(query) ||
      (bp.purpose || '').toLowerCase().includes(query) ||
      (bp.description || '').toLowerCase().includes(query)
    )
  }

  // Filter by category
  if (category) {
    result = result.filter(bp => (bp.category || '').trim().toLowerCase() === category)
  }

  // Filter by difficulty
  if (diff) {
    result = result.filter(bp => bp.difficulty === diff)
  }

  // Sort results
  if (sortBy.value === 'timeAsc') {
    result.sort((a, b) => parseTime(a.time) - parseTime(b.time))
  } else if (sortBy.value === 'timeDesc') {
    result.sort((a, b) => parseTime(b.time) - parseTime(a.time))
  } else if (sortBy.value === 'difficultyAsc') {
    result.sort((a, b) => getDifficultyValue(a.difficulty) - getDifficultyValue(b.difficulty))
  } else if (sortBy.value === 'difficultyDesc') {
    result.sort((a, b) => getDifficultyValue(b.difficulty) - getDifficultyValue(a.difficulty))
  } else {
    // Default: sort by English title when available, fall back to original
    result.sort((a, b) => englishTitle(a.title).localeCompare(englishTitle(b.title), 'en'))
  }

  return result
})

// When filters change, reset to first page
watch([q, cat, difficulty, sortBy, () => filteredBlueprints.value.length], () => {
  page.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredBlueprints.value.length / pageSize.value)))

const pagedBlueprints = computed(() => {
  const start = (page.value - 1) * pageSize.value
  return filteredBlueprints.value.slice(start, start + pageSize.value)
})

const startItem = computed(() => filteredBlueprints.value.length === 0 ? 0 : (page.value - 1) * pageSize.value + 1)
const endItem = computed(() => Math.min(filteredBlueprints.value.length, page.value * pageSize.value))

function prevPage() {
  if (page.value > 1) page.value--
}

function nextPage() {
  if (page.value < totalPages.value) page.value++
}

// Return the image URL to use for a blueprint. Add a cache-busting query for lemon-battery
const imageFor = (bp: Blueprint) => {
  if (!bp || !bp.image) return undefined
  try {
    if (bp.id === 'lemon-battery') {
      // prefer explicit cache-busted path if not already present
      return bp.image.includes('?') ? bp.image : `${bp.image}?v=2`
    }
    return bp.image
  } catch (e) {
    return bp.image
  }
}

// Helper function to parse time string to minutes
function parseTime(timeStr: string): number {
  if (!timeStr) return 0
  const match = timeStr.match(/(\d+)/)
  if (!match) return 0
  const num = Number.parseInt(match[1])
  if (timeStr.includes('ชั่วโมง') || timeStr.includes('hour')) return num * 60
  if (timeStr.includes('วัน') || timeStr.includes('day')) return num * 1440
  if (timeStr.includes('สัปดาห์') || timeStr.includes('week')) return num * 10080
  return num // assume minutes
}

// Helper function to get difficulty numeric value
function getDifficultyValue(difficulty: string): number {
  if (difficulty === 'Easy') return 1
  if (difficulty === 'Medium') return 2
  if (difficulty === 'Hard') return 3
  return 0
}

// Reset all filters
function resetFilters() {
  q.value = ''
  cat.value = ''
  difficulty.value = ''
  sortBy.value = 'default'
}

onMounted(() => {
  console.log('📄 BlueprintLibrary mounted (client-only)')
  // Debug: log the image path for lemon-battery to help diagnose missing thumbnail
  try {
    const lemon = allBlueprints.find(b => b.id === 'lemon-battery')
    if (lemon) {
      console.log('DEBUG: lemon-battery image=', lemon.image, 'raw=', JSON.stringify(lemon.image))
    } else {
      console.log('DEBUG: lemon-battery not found in allBlueprints')
    }
  } catch (e) {
    console.error('DEBUG: error checking lemon-battery image', e)
  }
  // If a ?page= query param is present, respect it on mount so SSR links work
  try {
    const route = useRoute()
    const p = Number(route.query.page)
    if (p && Number.isFinite(p) && p >= 1) {
      page.value = Math.min(p, totalPages.value)
    }
  } catch (e) {
    // ignore if router unavailable
  }
})
</script>
