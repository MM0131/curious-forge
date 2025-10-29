<template>
  <section class="py-14">
    <h1 class="text-3xl font-extrabold mb-8">คลังพิมพ์เขียว</h1>

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
          placeholder="🔍 ค้นหาโปรเจกต์ เช่น ภูเขาไฟ, แบตเตอรี่, กล้อง..."
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
          <option value="">📚 หมวดหมู่ทั้งหมด</option>
          <option value="Chemistry">🧪 เคมี</option>
          <option value="Physics">⚛️ ฟิสิกส์</option>
          <option value="Biology">🧬 ชีววิทยา</option>
          <option value="Energy">⚡ พลังงาน</option>
          <option value="Geology">🌍 ธรณีวิทยา</option>
          <option value="Engineering">⚙️ วิศวกรรม</option>
        </select>

        <!-- Difficulty Filter -->
        <select
          v-model="difficulty"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="">🎯 ระดับความยากทั้งหมด</option>
          <option value="Easy">😊 ง่าย</option>
          <option value="Medium">🤔 ปานกลาง</option>
          <option value="Hard">🔥 ยาก</option>
        </select>

        <!-- Sort Options -->
        <select
          v-model="sortBy"
          class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 outline-none focus:ring-2 focus:ring-violet-500 transition"
        >
          <option value="default">🔤 เรียงตามชื่อ (ก-ฮ)</option>
          <option value="timeAsc">⏱️ เวลาน้อย → มาก</option>
          <option value="timeDesc">⏱️ เวลามาก → น้อย</option>
          <option value="difficultyAsc">📈 ง่าย → ยาก</option>
          <option value="difficultyDesc">📉 ยาก → ง่าย</option>
        </select>
      </div>

      <!-- Results Summary -->
      <div class="flex items-center justify-between text-sm text-slate-400">
        <p>
          <span class="text-violet-400 font-semibold">{{ filteredBlueprints.length }}</span> โปรเจกต์
          <span v-if="q || cat || difficulty"> (กรองแล้ว)</span>
        </p>
        <button
          v-if="q || cat || difficulty || sortBy !== 'default'"
          @click="resetFilters"
          class="text-violet-400 hover:text-violet-300 transition flex items-center gap-1"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
          </svg>
          รีเซ็ตตัวกรอง
        </button>
      </div>
    </div>

    <div v-if="filteredBlueprints.length === 0" class="text-center py-12">
      <p class="text-xl text-slate-400">ไม่พบพิมพ์เขียว</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="bp in filteredBlueprints"
        :key="bp.id"
        class="card hover:bg-white/7 transition relative"
      >
        <button
          class="absolute top-3 right-3 z-10 rounded-lg border border-white/10 bg-black/30 backdrop-blur px-2 py-1 text-xs hover:bg-black/50"
          @click.stop="onToggle(bp.id)"
          :aria-pressed="isSaved(bp.id)"
          :title="isSaved(bp.id) ? 'ลบออกจากที่บันทึก' : 'บันทึกโปรเจกต์'"
        >
          {{ isSaved(bp.id) ? 'บันทึกแล้ว' : 'บันทึก' }}
        </button>
        <img v-if="bp.image" :src="bp.image" :alt="bp.title" class="w-full h-44 object-cover rounded-xl mb-4" />
        <h3 class="text-lg font-semibold leading-snug">{{ bp.title }}</h3>
        <p class="mt-1 text-sm text-slate-300 line-clamp-2">{{ bp.purpose }}</p>

        <div class="mt-4 flex items-center gap-3 text-xs text-slate-300">
          <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ bp.time }}</span>
          <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ (bp.materials?.length || 0) }} วัสดุ</span>
          <span class="px-2 py-1 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-200">{{ bp.difficulty }}</span>
        </div>

        <div class="mt-5">
          <NuxtLink :to="`/blueprints/${bp.id}`" class="btn-primary inline-flex items-center gap-2">
            ดูรายละเอียด
            <span class="-mr-1">👁️</span>
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
import { ref, computed, onMounted } from 'vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'
import { useSaved } from '~/composables/useSaved'
import { useAuth } from '~/composables/useAuth'
import { useRouter } from 'vue-router'

const isDev = import.meta.env.DEV
const q = ref('')
const cat = ref('')
const difficulty = ref('')
const sortBy = ref('default')
const n = ref(0)

const allBlueprints = blueprintsData as Blueprint[]

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
}

onMounted(() => {
  console.log('📄 BlueprintLibrary mounted (client-only)')
})
</script>
