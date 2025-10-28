<template>
  <section class="py-14">
    <h1 class="text-3xl font-extrabold mb-8">โปรไฟล์</h1>

    <ClientOnly>
      <template #fallback>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
          <div class="card h-28 animate-pulse-glow" />
          <div class="card h-28 animate-pulse-glow" />
          <div class="card h-28 animate-pulse-glow" />
        </div>
      </template>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard :value="viewCount" label="ดูแล้ว" />
        <StatCard :value="savedCount" label="บันทึก" />
        <StatCard :value="contributeCount" label="ร่วม" />
      </div>

      <h2 class="mt-10 text-xl font-semibold">โปรเจกต์ที่บันทึกไว้</h2>

      <div v-if="savedBlueprints.length === 0" class="mt-6 text-slate-400 text-sm">
        ยังไม่มีโปรเจกต์ที่บันทึกไว้ — ไปที่หน้า <NuxtLink class="text-violet-400 hover:underline" to="/library">Library</NuxtLink> แล้วกด “บันทึกโปรเจกต์” ได้เลย
      </div>

      <div v-else class="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="bp in savedBlueprints" :key="bp.id" class="relative group">
          <BlueprintCard
            :title="bp.title"
            :subtitle="bp.purpose"
            :time="bp.time"
            :people="(bp.materials?.length || 0) + ' วัสดุ'"
            :level="bp.difficulty"
            :cover="bp.image"
            :to="`/blueprints/${bp.id}`"
          />
          <button
            @click="removeSaved(bp.id)"
            class="absolute top-3 right-3 px-2 py-1 text-xs rounded-lg bg-white/10 hover:bg-white/20 border border-white/10"
            aria-label="ลบออกจากที่บันทึก"
          >ลบ</button>
        </div>
      </div>
    </ClientOnly>
  </section>
</template>

<script setup lang="ts">
// no-op
import StatCard from '~/components/StatCard.vue'
import BlueprintCard from '~/components/BlueprintCard.vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'
import { useSaved } from '~/composables/useSaved'

const all = blueprintsData as Blueprint[]
const { savedIds, savedBlueprints, count: savedCount, remove } = useSaved()
// ยังไม่มีการเก็บสถิติจริงสำหรับ 2 ค่าแรก/สุดท้าย จึงใส่ 0 ไว้ก่อน
const viewCount = 0
const contributeCount = 0

function removeSaved(id: string) { remove(id) }
</script>
