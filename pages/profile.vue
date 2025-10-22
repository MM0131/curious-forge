<template>
  <section class="py-8">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold">โปรไฟล์</h1>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        <StatCard label="ดูแล้ว" value="12" />
        <StatCard label="บันทึก" value="3" />
        <StatCard label="ร่วม" value="1" />
      </div>

      <div class="mt-6">
        <h2 class="font-semibold">โปรเจกต์ที่บันทึกไว้</h2>
        <ul class="mt-2">
          <li v-for="id in saved" :key="id">{{ id }}</li>
        </ul>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import StatCard from '~/components/StatCard.vue'
import { ref, onMounted } from 'vue'

const saved = ref<string[]>([])
onMounted(() => {
  saved.value = JSON.parse(localStorage.getItem('saved') || '[]')
})
</script>
