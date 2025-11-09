<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-center justify-center p-4"
        @click.self="close"
      >
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

        <!-- Modal Content -->
        <div
          class="relative card max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border-white/20"
          @click.stop
        >
          <!-- Header -->
          <div v-if="title || $slots.header" class="flex items-center justify-between mb-6">
            <slot name="header">
              <h3 class="text-2xl font-bold">{{ title }}</h3>
            </slot>
            <button
              class="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-white/10 transition flex items-center justify-center"
              @click="close"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Body -->
          <div>
            <slot></slot>
          </div>

          <!-- Footer -->
          <div v-if="$slots.footer" class="mt-6 pt-6 border-t border-white/10">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch } from 'vue'

interface Props {
  modelValue: boolean
  title?: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

function close() {
  emit('update:modelValue', false)
}

// Close on Escape key
function handleEscape(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

function setBodyScrollLock(lock: boolean) {
  if (import.meta.client) {
    const body = document.body
    body.style.overflow = lock ? 'hidden' : ''
  }
}

onMounted(() => {
  if (!import.meta.client) return
  // Watch open/close state only on client
  watch(
    () => props.modelValue,
    (open) => {
      if (open) {
        document.addEventListener('keydown', handleEscape)
        setBodyScrollLock(true)
      } else {
        document.removeEventListener('keydown', handleEscape)
        setBodyScrollLock(false)
      }
    },
    { immediate: true }
  )
})

onBeforeUnmount(() => {
  if (!import.meta.client) return
  document.removeEventListener('keydown', handleEscape)
  setBodyScrollLock(false)
})
</script>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .card,
.modal-leave-active .card {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .card,
.modal-leave-to .card {
  transform: scale(0.9);
  opacity: 0;
}
</style>
