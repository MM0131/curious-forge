<template>
  <div class="card flex flex-col items-center text-center w-full">
    <div class="text-4xl font-extrabold tracking-tight">{{ value }}</div>
    <div class="mt-2 text-slate-300 text-sm">{{ label }}</div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ value: number | string; label: string }>();
</script>
