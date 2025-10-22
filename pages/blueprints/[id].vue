<template>
  <section class="py-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="bp">
        <h1 class="text-3xl font-bold">{{ bp.title }}</h1>
        <p class="text-sm text-slate-300">{{ bp.category }} • {{ bp.difficulty }} • {{ bp.time }}</p>

        <div class="mt-6 flex gap-3">
          <button class="btn-primary">พิมพ์</button>
          <button class="btn-primary bg-white/6">แชร์</button>
          <button class="btn-primary bg-white/6" @click="save">บันทึกโปรเจกต์</button>
        </div>

        <section class="mt-6 card">
          <h2 class="font-semibold">วัตถุประสงค์</h2>
          <p class="text-slate-300 mt-2">{{ bp.purpose }}</p>
        </section>

        <section class="mt-4 card">
          <h2 class="font-semibold">วัสดุ</h2>
          <ul class="list-disc list-inside text-slate-300">
            <li v-for="m in bp.materials" :key="m">{{ m }}</li>
          </ul>
        </section>

        <section class="mt-4 card">
          <h2 class="font-semibold">ขั้นตอน</h2>
          <ol class="list-decimal list-inside text-slate-300">
            <li v-for="s in bp.steps" :key="s">{{ s }}</li>
          </ol>
        </section>

        <section class="mt-4 card bg-rose-900/20 border-rose-700/20">
          <h2 class="font-semibold text-rose-300">คำเตือน</h2>
          <p class="text-slate-300">{{ bp.warnings }}</p>
        </section>
      </div>
      <div v-else>
        <p>กำลังโหลด...</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { onMounted, ref } from 'vue'
import { useBlueprints } from '~/composables/useBlueprints'

const route = useRoute()
const { list, load, findById } = useBlueprints()
const bp = ref<any | null>(null)

onMounted(async () => {
  if (!list.value.length) await load()
  bp.value = findById(route.params.id as string)
})

function save() {
  const saved = JSON.parse(localStorage.getItem('saved') || '[]')
  if (bp.value && !saved.includes(bp.value.id)) {
    saved.push(bp.value.id)
    localStorage.setItem('saved', JSON.stringify(saved))
    alert('บันทึกเรียบร้อย')
  }
}
</script>
