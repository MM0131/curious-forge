<template>
  <section class="py-14">
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-extrabold mb-6">ส่งไอเดียของคุณ</h1>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <InputField
          id="name"
          label="ชื่อ"
          :value="form.name"
          placeholder="เช่น สมชาย ใจดี"
          @input="(e: Event) => form.name = (e.target as HTMLInputElement).value"
          :aria-invalid="!!errors.name"
        />
        <InputField
          id="email"
          label="อีเมล"
          type="email"
          :value="form.email"
          placeholder="you@example.com"
          @input="(e: Event) => form.email = (e.target as HTMLInputElement).value"
          :aria-invalid="!!errors.email"
        />
        <InputField
          id="projectTitle"
          label="ชื่อโปรเจกต์"
          :value="form.title"
          placeholder="เช่น กล้องออบสคูราแบบ DIY"
          @input="(e: Event) => form.title = (e.target as HTMLInputElement).value"
          :aria-invalid="!!errors.title"
        />

        <div class="grid md:grid-cols-2 gap-4">
          <SelectField
            id="category"
            label="หมวดหมู่"
            :value="form.category"
            @change="(e: Event) => form.category = (e.target as HTMLSelectElement).value"
          >
            <option value="">— เลือก —</option>
            <option value="Physics">ฟิสิกส์</option>
            <option value="Chemistry">เคมี</option>
            <option value="Biology">ชีววิทยา</option>
            <option value="Energy">พลังงาน</option>
            <option value="Geology">ธรณีวิทยา</option>
            <option value="Engineering">วิศวกรรม</option>
          </SelectField>
          <SelectField
            id="difficulty"
            label="ความยาก"
            :value="form.difficulty"
            @change="(e: Event) => form.difficulty = (e.target as HTMLSelectElement).value"
          >
            <option value="">— เลือก —</option>
            <option value="Easy">ง่าย</option>
            <option value="Medium">กลาง</option>
            <option value="Hard">ยาก</option>
          </SelectField>
        </div>

        <div class="space-y-2">
          <label for="steps" class="text-sm text-slate-300">ขั้นตอน</label>
          <textarea
            id="steps"
            rows="4"
            :value="form.steps"
            @input="(e: Event) => form.steps = (e.target as HTMLTextAreaElement).value"
            placeholder="อธิบายขั้นตอนการทำทีละข้อ..."
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
          />
        </div>

        <div class="space-y-2">
          <label for="materials" class="text-sm text-slate-300">วัสดุ</label>
          <textarea
            id="materials"
            rows="3"
            :value="form.materials"
            @input="(e: Event) => form.materials = (e.target as HTMLTextAreaElement).value"
            placeholder="เช่น กระดาษแข็ง, กาวร้อน, ไม้ไอศกรีม, เชือก..."
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
          />
        </div>

        <div class="pt-2">
          <button :disabled="!isValid" type="submit" class="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">ส่งไอเดียของฉัน</button>
        </div>

        <p v-if="firstAttempt && !isValid" class="text-rose-300 text-sm">กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน</p>
      </form>
    </div>

    <Toast
      v-if="toast.show"
      :type="toast.type"
      :message="toast.message"
      @close="toast.show = false"
    />
  </section>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue'
import InputField from '~/components/InputField.vue'
import SelectField from '~/components/SelectField.vue'
import Toast from '~/components/Toast.vue'

const form = reactive({
  name: '',
  email: '',
  title: '',
  category: '',
  difficulty: '',
  steps: '',
  materials: ''
})

const errors = reactive<{ [k: string]: string | null }>({
  name: null,
  email: null,
  title: null
})

const firstAttempt = ref(false)

const isValid = computed(() => {
  errors.name = form.name.trim() ? null : 'ต้องกรอกชื่อ'
  errors.email = /.+@.+\..+/.test(form.email) ? null : 'อีเมลไม่ถูกต้อง'
  errors.title = form.title.trim() ? null : 'ต้องกรอกชื่อโปรเจกต์'
  return !errors.name && !errors.email && !errors.title
})

const toast = reactive({ show: false, type: 'success' as 'success'|'error'|'warning'|'info', message: '' })
function showToast(type: 'success'|'error'|'warning'|'info', message: string) {
  toast.type = type
  toast.message = message
  toast.show = true
}

function onSubmit() {
  firstAttempt.value = true
  if (!isValid.value) return

  // จำลองการส่งข้อมูลสำเร็จ
  showToast('success', 'ส่งไอเดียสำเร็จ ขอบคุณมาก! 🎉')
  Object.assign(form, { name: '', email: '', title: '', category: '', difficulty: '', steps: '', materials: '' })
  firstAttempt.value = false
}
</script>
