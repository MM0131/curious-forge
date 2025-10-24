<template>
  <section class="py-8">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-6">
        <h1 class="text-2xl font-bold">คลังพิมพ์เขียว</h1>
        <div class="flex gap-3">
          <input v-model="q" placeholder="ค้นหาโปรเจกต์" class="bg-white/3 rounded-lg p-2 text-slate-100" />
          <select v-model="category" class="bg-white/3 rounded-lg p-2 text-slate-100">
            <option value="">ทั้งหมด</option>
            <option v-for="c in categories" :key="c">{{ c }}</option>
          </select>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <RouterLink
          v-for="blueprint in filtered"
          :key="blueprint.id"
          :to="`/blueprints/${blueprint.id}`"
          class="bg-slate-800 rounded-2xl overflow-hidden hover:bg-slate-700 transition-colors"
        >
          <BlueprintCard :blueprint="blueprint" />
        </RouterLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from '#imports'
import BlueprintCard from '~/components/BlueprintCard.vue'
import { useBlueprints } from '~/composables/useBlueprints'

const q = ref('')
const category = ref('')
const { list, load } = useBlueprints()
const categories = ['Chemistry', 'Physics', 'Engineering', 'Energy', 'Biology', 'Geology']

onMounted(() => load())

const filtered = computed(() => {
  let res = list.value
  if (q.value) res = res.filter(b => b.title.toLowerCase().includes(q.value.toLowerCase()))
  if (category.value) res = res.filter(b => b.category === category.value)
  return res
})
</script>
