<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        class="fixed top-4 right-4 z-50 max-w-md animate-slide-in-right"
      >
        <div
          class="card flex items-start gap-3 shadow-2xl border-2"
          :class="{
            'border-emerald-500/50 bg-emerald-900/30': type === 'success',
            'border-red-500/50 bg-red-900/30': type === 'error',
            'border-amber-500/50 bg-amber-900/30': type === 'warning',
            'border-blue-500/50 bg-blue-900/30': type === 'info',
          }"
        >
          <!-- Icon -->
          <div class="flex-shrink-0 text-2xl">
            <span v-if="type === 'success'">✅</span>
            <span v-else-if="type === 'error'">❌</span>
            <span v-else-if="type === 'warning'">⚠️</span>
            <span v-else>ℹ️</span>
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 v-if="title" class="font-semibold mb-1">{{ title }}</h4>
            <p class="text-sm text-slate-300">{{ message }}</p>
          </div>

          <!-- Close Button -->
          <button
            @click="close"
            class="flex-shrink-0 text-slate-400 hover:text-white transition"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Props {
  type?: 'success' | 'error' | 'warning' | 'info'
  title?: string
  message: string
  duration?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000
})

const emit = defineEmits<{
  close: []
}>()

const visible = ref(false)

let timer: ReturnType<typeof setTimeout> | null = null

function close() {
  visible.value = false
  if (timer) clearTimeout(timer)
  setTimeout(() => emit('close'), 300)
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    timer = setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-right {
  animation: slide-in-right 0.3s ease-out;
}
</style>
