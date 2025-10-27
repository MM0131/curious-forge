<template>
  <div class="space-y-2">
    <label v-if="label" :for="id" class="text-sm text-slate-300">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{ id?: string; label?: string }>();
</script>
