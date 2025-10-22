<template>
  <div class="card text-center p-4">
    <div class="text-2xl font-bold">{{ value }}</div>
    <div class="text-sm text-slate-300">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string; value: string | number }>()
</script>
