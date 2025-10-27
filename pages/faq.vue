<template>
  <section class="py-14">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <h1 class="text-4xl font-extrabold mb-4">คำถามที่พบบ่อย</h1>
        <p class="text-xl text-slate-300">คำตอบสำหรับคำถามที่คุณอาจสงสัย</p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <!-- FAQ 1 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(1)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">The Curious Forge คืออะไร?</h3>
              <p v-if="openFaq === 1" class="text-slate-300 leading-relaxed">
                The Curious Forge คือแพลตฟอร์มออนไลน์ที่รวบรวมพิมพ์เขียวโปรเจกต์วิทยาศาสตร์และวิศวกรรมที่น่าสนใจ เพื่อให้ทุกคนสามารถเรียนรู้และทำโปรเจกต์ด้วยตัวเองได้
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 1 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 2 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(2)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">โปรเจกต์เหล่านี้เหมาะสำหรับใคร?</h3>
              <p v-if="openFaq === 2" class="text-slate-300 leading-relaxed">
                โปรเจกต์ของเราเหมาะสำหรับทุกคน! ไม่ว่าคุณจะเป็นนักเรียน ครู พ่อแม่ หรือแค่คนที่สนใจวิทยาศาสตร์ เรามีโปรเจกต์ทุกระดับความยาก
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 2 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 3 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(3)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">วัสดุที่ใช้หาได้ง่ายไหม?</h3>
              <p v-if="openFaq === 3" class="text-slate-300 leading-relaxed">
                ใช่! เราเลือกโปรเจกต์ที่ใช้วัสดุที่หาได้ง่ายและราคาไม่แพง ส่วนใหญ่เป็นของใช้ในบ้านหรือซื้อได้จากร้านวัสดุทั่วไป
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 3 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 4 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(4)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">โปรเจกต์นี้ปลอดภัยไหม?</h3>
              <p v-if="openFaq === 4" class="text-slate-300 leading-relaxed">
                ความปลอดภัยเป็นสิ่งสำคัญสำหรับเรา! ทุกโปรเจกต์มีคำเตือนและข้อควรระวังที่ชัดเจน สำหรับโปรเจกต์ที่มีความเสี่ยง เราแนะนำให้มีผู้ใหญ่ดูแล
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 4 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 5 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(5)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">สามารถส่งไอเดียโปรเจกต์ได้ไหม?</h3>
              <p v-if="openFaq === 5" class="text-slate-300 leading-relaxed">
                ได้แน่นอน! คุณสามารถส่งไอเดียผ่านหน้า "Submit" หรือติดต่อเราผ่านอีเมล ideas@curiousforge.edu
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 5 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 6 -->
        <div class="card hover:bg-white/7 transition">
          <button
            @click="toggleFaq(6)"
            class="w-full text-left flex items-start justify-between gap-4"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">มีค่าใช้จ่ายไหม?</h3>
              <p v-if="openFaq === 6" class="text-slate-300 leading-relaxed">
                ไม่! The Curious Forge เป็นแพลตฟอร์มฟรีสำหรับทุกคน คุณสามารถเข้าถึงพิมพ์เขียวทั้งหมดได้ฟรีตลอดไป
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 6 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Still have questions CTA -->
      <div class="mt-12 card bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-700/20 text-center">
        <h3 class="text-xl font-semibold mb-4">ยังมีคำถามอีกไหม?</h3>
        <p class="text-slate-300 mb-6">เราพร้อมช่วยเหลือคุณเสมอ!</p>
        <NuxtLink to="/contact" class="btn-primary">
          ติดต่อเรา
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

function toggleFaq(id: number) {
  openFaq.value = openFaq.value === id ? null : id
}

useSeoMeta({
  title: 'คำถามที่พบบ่อย - The Curious Forge',
  description: 'คำตอบสำหรับคำถามที่พบบ่อยเกี่ยวกับ The Curious Forge และโปรเจกต์วิทยาศาสตร์'
})
</script>

