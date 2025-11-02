<template>
  <section class="py-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
  <h1 class="text-2xl font-bold">Blueprint Library</h1>
        <div class="flex gap-3">
          <input v-model="q" placeholder="Search projects" class="bg-white/3 rounded-lg p-2 text-slate-100" />
          <select v-model="category" class="bg-white/3 rounded-lg p-2 text-slate-100">
            <option value="">All</option>
            <option v-for="c in categories" :key="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BlueprintCard
          v-for="bp in filtered"
          :key="bp.id"
          :title="bp.title"
          :subtitle="bp.description || bp.purpose"
          :time="bp.time || '—'"
          :people="(bp.materials?.length || 0) + ' materials'"
          :level="bp.difficulty || 'Unknown'"
          :cover="bp.image"
          :to="`/blueprints/${bp.id}`"
        />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import BlueprintCard from '~/components/BlueprintCard.vue'
import { useBlueprints } from '~/composables/useBlueprints'

const q = ref('')
const category = ref('')
const { list, load } = useBlueprints()
const categories = ['Chemistry','Physics','Engineering']

onMounted(() => load())

const filtered = computed(() => {
  let res = list.value
  if (q.value) res = res.filter(b => b.title.toLowerCase().includes(q.value.toLowerCase()))
  if (category.value) res = res.filter(b => b.category === category.value)
  return res
})
</script>
