<template>
  <div class="space-y-1">
    <label v-if="label" :for="id" class="text-sm text-slate-300">{{ label }}</label>
    <input
      :id="id"
      v-bind="$attrs"
      :aria-invalid="!!error"
      :aria-describedby="error ? `${id}-error` : undefined"
      :class="[
        'w-full rounded-xl bg-white/5 px-4 py-2 outline-none focus:ring-2 text-slate-100 placeholder-slate-400 caret-violet-400',
        error ? 'border-rose-500/50 focus:ring-rose-500' : 'border-white/10 focus:ring-violet-500'
      ]"
    />
    <p v-if="error" :id="`${id}-error`" class="text-rose-300 text-sm">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
defineProps<{ id?: string; label?: string; error?: string | null }>();
</script>
