<template>
  <section class="py-12">
    <div class="max-w-4xl mx-auto text-center">
      <img src="/assets/images/logo.svg" alt="logo" class="mx-auto h-20" />
      <h1 class="text-4xl font-bold mt-6">วิทยาศาสตร์ด้วยมือ</h1>
      <p class="text-slate-300 mt-2">ทดลอง ทำความเข้าใจ และสร้างด้วยตัวเอง</p>
      <div class="mt-6 flex justify-center gap-4">
        <NuxtLink to="/library" class="btn-primary">เริ่มสำรวจ</NuxtLink>
        <NuxtLink to="/submit" class="btn-primary bg-white/6 text-white">ส่งไอเดีย</NuxtLink>
      </div>

      <h2 class="text-2xl font-semibold mt-12 mb-4">แนะนำโปรเจกต์</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BlueprintCard v-for="bp in top" :key="bp.id" :blueprint="bp" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useBlueprints } from '~/composables/useBlueprints'
import BlueprintCard from '~/components/BlueprintCard.vue'

const { list, load } = useBlueprints()
const top = ref([])
onMounted(async () => {
  await load()
  top.value = list.value.slice(0,3)
})
</script>
