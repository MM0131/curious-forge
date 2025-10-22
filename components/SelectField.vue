<template>
  <div class="flex flex-col">
    <label class="text-sm text-slate-300 mb-1" :for="id">{{ label }}</label>
    <select :id="id" :value="modelValue" @change="onChange" class="bg-white/3 border border-white/8 rounded-lg p-2 text-slate-100">
      <option value="">-- เลือก --</option>
      <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
    </select>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; options: string[]; modelValue: string; id?: string }>()
const emit = defineEmits(['update:modelValue'])
const id = props.id || `select-${Math.random().toString(36).slice(2,8)}`
function onChange(e: Event) { emit('update:modelValue', (e.target as HTMLSelectElement).value) }
</script>
