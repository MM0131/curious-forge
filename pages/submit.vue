<template>
  <section class="py-8">
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-bold">ส่งไอเดียของคุณ</h1>
      <form @submit.prevent="onSubmit" class="mt-4 flex flex-col gap-4">
        <InputField v-model="name" label="ชื่อ" />
        <InputField v-model="email" label="อีเมล" type="email" />
        <InputField v-model="title" label="ชื่อโปรเจกต์" />
        <SelectField v-model="category" :options="categories" label="หมวดหมู่" />
        <SelectField v-model="difficulty" :options="difficulties" label="ความยาก" />
        <div>
          <label class="text-sm text-slate-300 mb-1">ขั้นตอน</label>
          <textarea v-model="steps" class="w-full rounded-lg p-2 bg-white/3 text-slate-100"></textarea>
        </div>
        <div>
          <label class="text-sm text-slate-300 mb-1">วัสดุ</label>
          <textarea v-model="materials" class="w-full rounded-lg p-2 bg-white/3 text-slate-100"></textarea>
        </div>

        <button class="btn-primary mt-2">ส่งไอเดียของฉัน</button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import InputField from '~/components/InputField.vue'
import SelectField from '~/components/SelectField.vue'

const name = ref('')
const email = ref('')
const title = ref('')
const category = ref('')
const difficulty = ref('')
const steps = ref('')
const materials = ref('')

const categories = ['Chemistry','Physics','Engineering']
const difficulties = ['Easy','Medium','Hard']

function onSubmit() {
  console.log({ name: name.value, email: email.value, title: title.value })
  alert('ขอบคุณสำหรับไอเดีย!')
}
</script>
