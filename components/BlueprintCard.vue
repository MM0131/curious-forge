<template>
  <NuxtLink :to="`/blueprints/${blueprint.id}`" class="card block hover:-translate-y-1 transition-transform glow-hover">
    <div class="flex items-start gap-4">
      <div class="w-16 h-16 rounded-xl bg-gradient-to-tr from-blue-600 to-violet-600 flex items-center justify-center text-white font-bold">BF</div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold">{{ blueprint.title }}</h3>
        <p class="text-sm text-slate-300">{{ blueprint.category }} • {{ blueprint.difficulty }}</p>
        <div class="mt-3 flex gap-2">
          <span class="text-xs bg-white/5 px-2 py-1 rounded-full">{{ blueprint.time }}</span>
        </div>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
defineProps<{ blueprint: any }>()
</script>
