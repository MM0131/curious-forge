<template>
  <div class="bg-slate-800 rounded-xl p-6 flex flex-col items-center text-center shadow-lg">
    <div class="text-4xl mb-4">{{ icon }}</div>
    <h2 class="text-xl font-semibold mb-2">{{ title }}</h2>
    <p class="text-slate-300">{{ desc }}</p>
  </div>
</template>
<script setup lang="ts">
defineProps<{ icon: string, title: string, desc: string }>()
</script>
