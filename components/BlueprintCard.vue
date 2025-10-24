<template>
  <NuxtLink :to="`/blueprints/${blueprint.id}`" class="card block hover:-translate-y-1 transition-transform glow-hover">
    <div class="relative overflow-hidden rounded-xl aspect-[5/3] mb-4">
      <img v-if="blueprint.image" :src="blueprint.image" :alt="blueprint.title" class="w-full h-full object-cover" />
      <div v-else class="w-full h-full bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">
        {{ blueprint.title.slice(0, 2) }}
      </div>
    </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ blueprint.title }}</h3>
      <p class="text-sm text-slate-300 mb-3">{{ blueprint.category }} • {{ blueprint.difficulty }}</p>
      <div class="flex flex-wrap gap-2">
        <span class="text-xs bg-white/5 px-2 py-1 rounded-full">{{ blueprint.time }}</span>
        <span class="text-xs bg-white/5 px-2 py-1 rounded-full">{{ blueprint.materials.length }} วัสดุ</span>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ blueprint: any }>()
</script>
