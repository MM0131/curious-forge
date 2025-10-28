<template>
  <section class="py-14">
    <h1 class="text-3xl font-extrabold mb-8">{{ t('library.title') }}</h1>

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
          :placeholder="t('library.searchPlaceholder')"
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
          <option value="">{{ t('library.filter.category.all') }}</option>
          <option value="Chemistry">{{ t('library.filter.category.chemistry') }}</option>
          <option value="Physics">{{ t('library.filter.category.physics') }}</option>
          <option value="Biology">{{ t('library.filter.category.biology') }}</option>
          <option value="Energy">{{ t('library.filter.category.energy') }}</option>
          <option value="Geology">{{ t('library.filter.category.geology') }}</option>
          <option value="Engineering">{{ t('library.filter.category.engineering') }}</option>
        </select>

        <!-- Difficulty Filter -->
        <select
          v-model="difficulty"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="">{{ t('library.filter.difficulty.all') }}</option>
          <option value="Easy">{{ t('library.filter.difficulty.easy') }}</option>
          <option value="Medium">{{ t('library.filter.difficulty.medium') }}</option>
          <option value="Hard">{{ t('library.filter.difficulty.hard') }}</option>
        </select>

        <!-- Sort Options -->
        <select
          v-model="sortBy"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="default">{{ t('library.sort.nameAZ') }}</option>
          <option value="timeAsc">{{ t('library.sort.timeAsc') }}</option>
          <option value="timeDesc">{{ t('library.sort.timeDesc') }}</option>
          <option value="difficultyAsc">{{ t('library.sort.difficultyAsc') }}</option>
          <option value="difficultyDesc">{{ t('library.sort.difficultyDesc') }}</option>
        </select>
      </div>

      <!-- Results Summary -->
      <div class="flex items-center justify-between text-sm text-slate-400">
        <p>
          <span class="text-violet-400 font-semibold">{{ filteredBlueprints.length }}</span> {{ t('library.resultsCount') }}
          <span v-if="q || cat || difficulty"> {{ t('library.filtered') }}</span>
        </p>
        <button
          v-if="q || cat || difficulty || sortBy !== 'default'"
          @click="resetFilters"
          class="text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          {{ t('library.resetFilters') }}
        </button>
      </div>
    </div>

    <div v-if="filteredBlueprints.length === 0" class="text-center py-12">
      <p class="text-xl text-slate-400">{{ t('library.noResults') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="bp in filteredBlueprints"
        :key="bp.id"
        class="card hover:bg-white/7 transition relative"
      >
        <button
          class="absolute top-3 right-3 z-10 rounded-lg border border-white/10 bg-black/30 backdrop-blur px-2 py-1 text-xs hover:bg-black/50"
          @click.stop="trackToggleSave(bp.id)"
          :aria-pressed="isSaved(bp.id)"
          :title="isSaved(bp.id) ? t('library.card.unsave') : t('library.card.save')"
        >
          {{ isSaved(bp.id) ? t('library.card.saved') : t('library.card.save') }}
        </button>
        <img v-if="bp.image" :src="bp.image" :alt="bp.title" class="w-full h-44 object-cover rounded-xl mb-4" />
        <h3 class="text-lg font-semibold leading-snug">{{ bp.title }}</h3>
        <p class="mt-1 text-sm text-slate-300 line-clamp-2">{{ bp.purpose }}</p>

        <div class="mt-4 flex items-center gap-3 text-xs text-slate-300">
          <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ bp.time }}</span>
          <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ (bp.materials?.length || 0) }} {{ t('library.card.materials') }}</span>
          <span class="px-2 py-1 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-200">{{ bp.difficulty }}</span>
        </div>

        <div class="mt-5">
          <NuxtLink :to="`/blueprints/${bp.id}`" class="btn-primary inline-flex items-center gap-2">
            {{ t('library.card.viewDetails') }}
          </NuxtLink>
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
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'
import { useSaved } from '~/composables/useSaved'
import { useAnalytics } from '~/composables/useAnalytics'

const { t } = useI18n()
const isDev = import.meta.env.DEV
const q = ref('')
const cat = ref('')
const difficulty = ref('')
const sortBy = ref('default')
const n = ref(0)

const allBlueprints = blueprintsData as Blueprint[]

// saved state
const { isSaved, toggle: toggleSave } = useSaved()
const { track } = useAnalytics()

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
    // Default: sort by title
    result.sort((a, b) => a.title.localeCompare(b.title, 'th'))
  }

  return result
})

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
  track('filters_reset')
}

onMounted(() => {
  console.log('📄 BlueprintLibrary mounted (client-only)')
})

// Analytics watches
watch(q, (val, old) => {
  if (val !== old) track('search', { q: String(val || '').slice(0, 64), len: (val || '').length })
})
watch([cat, difficulty, sortBy], ([c, d, s], [pc, pd, ps]) => {
  if (c !== pc) track('filter_category', { cat: String(c || '') })
  if (d !== pd) track('filter_difficulty', { difficulty: String(d || '') })
  if (s !== ps) track('sort_change', { sortBy: String(s || '') })
})

function trackToggleSave(id: string) {
  const saved = isSaved(id)
  track(saved ? 'unsave' : 'save', { id })
  toggleSave(id)
}
</script>
