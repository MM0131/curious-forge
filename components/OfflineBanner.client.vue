<template>
  <transition name="fade">
    <div v-if="!online" class="w-full bg-amber-600 text-white text-sm py-2 text-center">
      คุณออฟไลน์อยู่ – บางส่วนของข้อมูลอาจไม่อัปเดต ขณะนี้ใช้งานแบบออฟไลน์จากแคช
      <button class="ml-3 underline" @click="refresh">ลองรีเฟรช</button>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'

const online = ref(true)

function update() {
  online.value = navigator.onLine
}

function refresh() {
  if (globalThis.window !== undefined) globalThis.window.location.reload()
}

onMounted(() => {
  update()
  globalThis.addEventListener('online', update)
  globalThis.addEventListener('offline', update)
})

onBeforeUnmount(() => {
  globalThis.removeEventListener('online', update)
  globalThis.removeEventListener('offline', update)
})
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .2s ease;
}
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
