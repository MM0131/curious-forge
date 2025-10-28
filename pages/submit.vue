<template>
  <section class="py-14">
    <div class="max-w-3xl mx-auto card">
      <h1 class="text-2xl font-extrabold mb-6">{{ t('submit.title') }}</h1>

      <form class="space-y-5" @submit.prevent="onSubmit">
        <InputField
          id="name"
          :label="t('submit.form.name')"
          :value="form.name"
          :placeholder="t('submit.form.namePlaceholder')"
          @input="(e: Event) => form.name = (e.target as HTMLInputElement).value"
          :error="nameError as any"
        />
        <InputField
          id="email"
          :label="t('submit.form.email')"
          type="email"
          :value="form.email"
          :placeholder="t('submit.form.emailPlaceholder')"
          @input="(e: Event) => form.email = (e.target as HTMLInputElement).value"
          :error="emailError as any"
        />
        <InputField
          id="projectTitle"
          :label="t('submit.form.projectTitle')"
          :value="form.title"
          :placeholder="t('submit.form.projectTitlePlaceholder')"
          @input="(e: Event) => form.title = (e.target as HTMLInputElement).value"
          :error="titleError as any"
        />

        <div class="grid md:grid-cols-2 gap-4">
          <SelectField
            id="category"
            :label="t('submit.form.category')"
            :value="form.category"
            @change="(e: Event) => form.category = (e.target as HTMLSelectElement).value"
          >
            <option value="">{{ t('submit.form.selectOption') }}</option>
            <option value="Physics">{{ t('library.filter.category.physics') }}</option>
            <option value="Chemistry">{{ t('library.filter.category.chemistry') }}</option>
            <option value="Biology">{{ t('library.filter.category.biology') }}</option>
            <option value="Energy">{{ t('library.filter.category.energy') }}</option>
            <option value="Geology">{{ t('library.filter.category.geology') }}</option>
            <option value="Engineering">{{ t('library.filter.category.engineering') }}</option>
          </SelectField>
          <SelectField
            id="difficulty"
            :label="t('submit.form.difficulty')"
            :value="form.difficulty"
            @change="(e: Event) => form.difficulty = (e.target as HTMLSelectElement).value"
          >
            <option value="">{{ t('submit.form.selectOption') }}</option>
            <option value="Easy">{{ t('library.filter.difficulty.easy') }}</option>
            <option value="Medium">{{ t('library.filter.difficulty.medium') }}</option>
            <option value="Hard">{{ t('library.filter.difficulty.hard') }}</option>
          </SelectField>
        </div>

        <div class="space-y-2">
          <label for="steps" class="text-sm text-slate-300">{{ t('submit.form.steps') }}</label>
          <textarea
            id="steps"
            rows="4"
            :value="form.steps"
            @input="(e: Event) => form.steps = (e.target as HTMLTextAreaElement).value"
            :placeholder="t('submit.form.stepsPlaceholder')"
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
          />
        </div>

        <div class="space-y-2">
          <label for="materials" class="text-sm text-slate-300">{{ t('submit.form.materials') }}</label>
          <textarea
            id="materials"
            rows="3"
            :value="form.materials"
            @input="(e: Event) => form.materials = (e.target as HTMLTextAreaElement).value"
            :placeholder="t('submit.form.materialsPlaceholder')"
            class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400 caret-violet-400"
          />
        </div>

        <div class="pt-2">
          <button type="submit" class="btn-primary w-full">{{ t('submit.form.submitButton') }}</button>
        </div>

        <p v-if="firstAttempt && !isValid" class="text-rose-300 text-sm">{{ t('submit.form.errorMessage') }}</p>
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
    showToast('warning', t('submit.form.errorMessage'))
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

  // จำลองการส่งข้อมูลสำเร็จ
  showToast('success', t('submit.successMessage'))
  Object.assign(form, { name: '', email: '', title: '', category: '', difficulty: '', steps: '', materials: '' })
  firstAttempt.value = false
}
</script>
