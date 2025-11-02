<template>
  <section class="py-14">
  <h1 class="text-3xl font-extrabold mb-8">Blueprint Library</h1>

    <div class="grid md:grid-cols-[1fr_260px] gap-4 mb-10">
      <input 
        v-model="q" 
        type="text"
        placeholder="Search projects" 
        class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500"
      />
      <select 
        v-model="cat"
        class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500"
      >
        <option value="">All</option>
        <option value="Chemistry">Chemistry</option>
        <option value="Physics">Physics</option>
        <option value="Biology">Biology</option>
        <option value="Energy">Energy</option>
        <option value="Geology">Geology</option>
        <option value="Engineering">Engineering</option>
      </select>
    </div>

    <div v-if="filteredBlueprints.length === 0" class="text-center py-12">
      <p class="text-xl text-slate-400">No blueprints found</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ClientOnly v-for="bp in filteredBlueprints" :key="bp.id">
          <NuxtLink
            :to="`/blueprints/${bp.id}`"
            class="block"
          >
            <BlueprintCard
              :cover="bp.image"
              :title="bp.title"
              :subtitle="bp.purpose"
              :time="bp.time"
              :people="(bp.materials?.length || 0) + ' materials'"
              :level="bp.difficulty"
              :to="`/blueprints/${bp.id}`"
            />
          </NuxtLink>
          <template #fallback>
            <div class="h-64 bg-white/5 rounded-xl animate-pulse"></div>
          </template>
        </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.en'

const q = ref('')
const cat = ref('')
const blueprints = ref<Blueprint[]>(blueprintsData as Blueprint[])

console.log('✅ Blueprints loaded:', blueprints.value.length)

const filteredBlueprints = computed(() => {
  if (!blueprints.value || !Array.isArray(blueprints.value)) {
    return []
  }
  
  let arr = [...blueprints.value]
  
  if (q.value) {
    arr = arr.filter(bp => 
      bp.title?.toLowerCase().includes(q.value.toLowerCase()) || 
      bp.purpose?.toLowerCase().includes(q.value.toLowerCase())
    )
  }
  if (cat.value) {
    arr = arr.filter(bp => bp.category === cat.value)
  }
  
  return arr
})
</script>
