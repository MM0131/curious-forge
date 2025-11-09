<template>
  <section class="py-14">
    <div class="max-w-3xl mx-auto card">
  <h1 class="text-2xl font-extrabold mb-6">{{ translateOr('submit.title', 'Submit your project') }}</h1>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <InputField
          id="name"
          :label="translateOr('submit.form.name', 'Your name')"
          :value="form.name"
          :placeholder="translateOr('submit.form.namePlaceholder', 'Full name')"
          :error="nameError as any"
          @input="(e: Event) => form.name = (e.target as HTMLInputElement).value"
        />
        <InputField
          id="email"
          :label="translateOr('submit.form.email', 'Email')"
          type="email"
          :value="form.email"
          :placeholder="translateOr('submit.form.emailPlaceholder', 'name@example.com')"
          :error="emailError as any"
          @input="(e: Event) => form.email = (e.target as HTMLInputElement).value"
        />
        <InputField
          id="projectTitle"
          :label="translateOr('submit.form.projectTitle', 'Project title')"
          :value="form.title"
          :placeholder="translateOr('submit.form.projectTitlePlaceholder', 'Short, descriptive title')"
          :error="titleError as any"
          @input="(e: Event) => form.title = (e.target as HTMLInputElement).value"
        />

        <div class="grid md:grid-cols-2 gap-4">
          <SelectField
            id="category"
            :label="translateOr('submit.form.category', 'Category')"
            :value="form.category"
            @change="(e: Event) => form.category = (e.target as HTMLSelectElement).value"
          >
            <option value="">{{ translateOr('submit.form.selectOption', 'Select...') }}</option>
            <option value="Physics">{{ translateOr('library.filter.category.physics', 'Physics') }}</option>
            <option value="Chemistry">{{ translateOr('library.filter.category.chemistry', 'Chemistry') }}</option>
            <option value="Biology">{{ translateOr('library.filter.category.biology', 'Biology') }}</option>
            <option value="Energy">{{ translateOr('library.filter.category.energy', 'Energy') }}</option>
            <option value="Geology">{{ translateOr('library.filter.category.geology', 'Geology') }}</option>
            <option value="Engineering">{{ translateOr('library.filter.category.engineering', 'Engineering') }}</option>
          </SelectField>
          <SelectField
            id="difficulty"
            :label="translateOr('submit.form.difficulty', 'Difficulty')"
            :value="form.difficulty"
            @change="(e: Event) => form.difficulty = (e.target as HTMLSelectElement).value"
          >
            <option value="">{{ translateOr('submit.form.selectOption', 'Select...') }}</option>
            <option value="Easy">{{ translateOr('library.filter.difficulty.easy', 'Easy') }}</option>
            <option value="Medium">{{ translateOr('library.filter.difficulty.medium', 'Medium') }}</option>
            <option value="Hard">{{ translateOr('library.filter.difficulty.hard', 'Hard') }}</option>
          </SelectField>
        </div>

        <div class="space-y-2">
          <label for="steps" class="text-sm text-slate-300">{{ translateOr('submit.form.steps', 'Steps / Instructions') }}</label>
          <textarea
            id="steps"
            rows="4"
            :value="form.steps"
            :placeholder="translateOr('submit.form.stepsPlaceholder', 'Write step-by-step instructions')"
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
            @input="(e: Event) => form.steps = (e.target as HTMLTextAreaElement).value"
          />
        </div>

        <div class="space-y-2">
          <label for="materials" class="text-sm text-slate-300">{{ translateOr('submit.form.materials', 'Materials') }}</label>
          <textarea
            id="materials"
            rows="3"
            :value="form.materials"
            :placeholder="translateOr('submit.form.materialsPlaceholder', 'List materials, one per line')"
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
            @input="(e: Event) => form.materials = (e.target as HTMLTextAreaElement).value"
          />
        </div>

        <div class="pt-2">
          <button type="submit" class="btn-primary w-full">{{ translateOr('submit.form.submitButton', 'Submit') }}</button>
        </div>

  <p v-if="firstAttempt && !isValid" class="text-rose-300 text-sm">{{ translateOr('submit.form.errorMessage', 'Please fill required fields') }}</p>
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

const { t } = useI18n()
// Helper to avoid showing raw i18n keys in UI when translations are missing
const translateOr = (key: string, fallback: string) => {
  const v = t(key)
  return v === key ? fallback : v
}

const form = reactive({
  name: '',
  email: '',
  title: '',
  category: '',
  difficulty: '',
  steps: '',
  materials: ''
})

const firstAttempt = ref(false)

// Separate validation computed properties
const nameError = computed(() => {
  if (!firstAttempt.value) return null
  return form.name.trim() ? null : t('submit.validation.nameRequired')
})

const emailError = computed(() => {
  if (!firstAttempt.value) return null
  return /.+@.+\..+/.test(form.email) ? null : t('submit.validation.emailInvalid')
})

const titleError = computed(() => {
  if (!firstAttempt.value) return null
  return form.title.trim() ? null : t('submit.validation.titleRequired')
})

const isValid = computed(() => {
  const nameOk = form.name.trim().length > 0
  const emailOk = /.+@.+\..+/.test(form.email)
  const titleOk = form.title.trim().length > 0
  return nameOk && emailOk && titleOk
})

const toast = reactive({ show: false, type: 'success' as 'success'|'error'|'warning'|'info', message: '' })
function showToast(type: 'success'|'error'|'warning'|'info', message: string) {
  toast.type = type
  toast.message = message
  toast.show = true
}

function onSubmit() {
  firstAttempt.value = true
  if (!isValid.value) {
  showToast('warning', translateOr('submit.form.errorMessage', 'Please fill required fields'))
    // focus first invalid field for better UX
    if (!form.name.trim()) {
      document.getElementById('name')?.focus()
    } else if (!/.+@.+\..+/.test(form.email)) {
      document.getElementById('email')?.focus()
    } else if (!form.title.trim()) {
      document.getElementById('projectTitle')?.focus()
    }
    return
  }

  // ส่งข้อมูลไปยัง API จริง
  const payload = {
    title: form.title,
    description: form.steps || form.title,
    category: form.category || 'general',
    difficulty: form.difficulty || 'beginner',
    materials: form.materials ? form.materials.split('\n').map(s => s.trim()).filter(Boolean) : [],
    submitter_name: form.name,
    submitter_email: form.email
  }

  ;(async () => {
    try {
      await $fetch('/api/submit', { method: 'POST', body: payload })
  // success
  showToast('success', translateOr('submit.successMessage', 'Thanks — your submission was received'))
      Object.assign(form, { name: '', email: '', title: '', category: '', difficulty: '', steps: '', materials: '' })
      firstAttempt.value = false
    } catch (err: any) {
      console.error('Submit error', err)
      showToast('error', err?.message || t('submit.form.serverError') || 'Failed to submit')
    }
  })()
}
</script>
