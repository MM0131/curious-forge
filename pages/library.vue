<template>
  <ClientOnly>
    <BlueprintLibrary />
    <template #fallback>
      <section class="py-14">
        <h1 class="text-3xl font-extrabold mb-8">คลังพิมพ์เขียว</h1>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="bp in allBlueprints" :key="bp.id" class="card hover:bg-white/7 transition">
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
      </section>
    </template>
  </ClientOnly>
</template>

<script setup lang="ts">
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'
// Fallback SSR list
const allBlueprints = (blueprintsData as Blueprint[])
</script>
