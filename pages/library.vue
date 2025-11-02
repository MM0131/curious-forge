<template>
  <ClientOnly>
    <BlueprintLibrary />
    <template #fallback>
      <section class="py-14">
    <h1 class="text-3xl font-extrabold mb-8">Blueprint Library</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- SSR fallback: render only the first page (6 items) to avoid overflowing the frame -->
          <div v-for="bp in allBlueprints.slice(0, 6)" :key="bp.id" class="card hover:bg-white/7 transition">
            <img v-if="bp.image" :src="bp.image" :alt="englishTitle(bp.title)" class="w-full h-44 object-cover rounded-xl mb-4" />
            <h3 class="text-lg font-semibold leading-snug">{{ englishTitle(bp.title) }}</h3>
            <p class="mt-1 text-sm text-slate-300 line-clamp-2">{{ englishPurpose(bp.purpose) }}</p>
            <div class="mt-4 flex items-center gap-3 text-xs text-slate-300">
              <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ bp.time || '—' }}</span>
              <span class="px-2 py-1 rounded-lg bg-white/5 border border-white/10">{{ (bp.materials?.length || 0) }} materials</span>
              <span class="px-2 py-1 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-200">{{ bp.difficulty || 'Unknown' }}</span>
            </div>
            <div class="mt-5">
              <NuxtLink :to="`/blueprints/${bp.id}`" class="btn-primary inline-flex items-center gap-2">
                View details
                <span class="-mr-1">👁️</span>
              </NuxtLink>
            </div>
          </div>
        </div>
        <div class="mt-8 text-sm text-slate-400">
          Showing <span class="font-semibold text-slate-200">1–{{ Math.min(allBlueprints.length, 6) }}</span> of <span class="font-semibold text-violet-400">{{ allBlueprints.length }}</span>. 
          <NuxtLink to="/library?page=2" class="text-violet-400 ml-2">Next page</NuxtLink>
        </div>
      </section>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.en'

// Fallback SSR list
const allBlueprints = (blueprintsData as Blueprint[])

// Extract English text from titles like "ชื่อไทย (English Name)".
const englishTitle = (title?: string) => {
  if (!title) return ''
  const m = title.match(/\(([^)]+)\)/)
  if (m && m[1]) return m[1].trim()
  return title
}

// Try to show an English-purpose when present in parentheses or any ASCII substring.
const englishPurpose = (purpose?: string) => {
  if (!purpose) return ''
  const m = purpose.match(/\(([^)]+)\)/)
  if (m && m[1]) return m[1].trim()
  const ascii = purpose.match(/[A-Za-z0-9 ,.'"-]{4,}/)
  if (ascii) return ascii[0].trim()
  return purpose
}
</script>
