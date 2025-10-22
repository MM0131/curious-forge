<template>
  <div class="flex flex-col">
    <label class="text-sm text-slate-300 mb-1" :for="id">{{ label }}</label>
    <input :id="id" :type="type" :value="modelValue" @input="onInput" class="bg-white/3 border border-white/8 rounded-lg p-2 text-slate-100" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ label: string; modelValue: string; type?: string; id?: string }>()
const emit = defineEmits(['update:modelValue'])

const id = props.id || `input-${Math.random().toString(36).slice(2,8)}`
function onInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  emit('update:modelValue', val)
}
</script>
