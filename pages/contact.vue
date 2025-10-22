<template>
  <section class="py-8">
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-bold">ติดต่อเรา</h1>
      <p class="text-slate-300 mt-2">อีเมล: hello@curiousforge.example • เบอร์: 012-345-6789</p>

      <form class="mt-4 flex flex-col gap-3">
        <InputField label="ชื่อ" v-model="name" />
        <InputField label="อีเมล" v-model="email" />
        <div>
          <label for="message" class="text-sm text-slate-300">ข้อความ</label>
          <textarea id="message" v-model="message" class="w-full rounded-lg p-2 bg-white/3 text-slate-100"></textarea>
        </div>
        <button class="btn-primary">ส่งข้อความ</button>
      </form>

      <div class="mt-6">
        <h2 class="font-semibold">FAQ ย่อย</h2>
        <p class="text-slate-300">ดูที่หน้า FAQ หรือส่งข้อความมาหาเรา</p>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import InputField from '~/components/InputField.vue'
import { ref } from 'vue'

const name = ref('')
const email = ref('')
const message = ref('')
</script>
