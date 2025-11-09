<!-- pages/contact.vue -->
<template>
  <section class="py-14">
    <div class="max-w-5xl mx-auto">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <div class="p-4 rounded-2xl bg-emerald-600/20 border border-emerald-500/30">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
        <div>
          <h1 class="text-3xl font-extrabold">{{ safeT('contact.title') }}</h1>
          <p class="text-slate-300 mt-1">{{ safeT('contact.subtitle') }}</p>
        </div>
      </div>

      <!-- Banner -->
      <div class="card bg-blue-900/20 border-blue-700/30 mb-8">
        <div class="flex items-start gap-3">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <div>
            <h3 class="font-semibold text-lg">{{ safeT('contact.banner.title') }}</h3>
            <p class="text-slate-300 text-sm mt-1">{{ safeT('contact.banner.description') }}</p>
          </div>
        </div>
      </div>

      <div class="grid md:grid-cols-2 gap-8">
        <!-- Left: Contact Info -->
        <div class="space-y-6">
          <!-- Email Section -->
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-blue-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h2 class="text-lg font-semibold">{{ safeT('contact.email.title') }}</h2>
            </div>
            <div class="space-y-3">
              <div class="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                <div class="text-xs text-slate-400 mb-1">{{ safeT('contact.email.general') }}</div>
                <a href="mailto:contact@curiousforge.edu" class="text-blue-300 hover:text-blue-200">contact@curiousforge.edu</a>
              </div>
              <div class="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30">
                <div class="text-xs text-slate-400 mb-1">{{ safeT('contact.email.ideas') }}</div>
                <a href="mailto:ideas@curiousforge.edu" class="text-emerald-300 hover:text-emerald-200">ideas@curiousforge.edu</a>
              </div>
              <div class="p-3 rounded-lg bg-purple-900/20 border border-purple-700/30">
                <div class="text-xs text-slate-400 mb-1">{{ safeT('contact.email.partnership') }}</div>
                <a href="mailto:partner@curiousforge.edu" class="text-purple-300 hover:text-purple-200">partner@curiousforge.edu</a>
              </div>
            </div>
          </div>

          <!-- Phone Section -->
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-emerald-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold">{{ safeT('contact.phone.title') }}</h2>
                <p class="text-sm text-slate-400">{{ safeT('contact.phone.hours') }}</p>
              </div>
            </div>
            <div class="space-y-3">
              <div class="p-3 rounded-lg bg-emerald-900/20 border border-emerald-700/30">
                <div class="text-xs text-slate-400 mb-1">{{ safeT('contact.phone.domestic') }}</div>
                  <div class="text-emerald-300">02-xxx-xxxx</div>
              </div>
              <div class="p-3 rounded-lg bg-blue-900/20 border border-blue-700/30">
                <div class="text-xs text-slate-400 mb-1">{{ safeT('contact.phone.education') }}</div>
                <div class="text-blue-300">02-xxx-xxxx ext. 101</div>
              </div>
            </div>
          </div>

          <!-- Address Section -->
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-purple-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold">{{ safeT('contact.address.title') }}</h2>
                <p class="text-sm text-slate-400">{{ safeT('contact.address.subtitle') }}</p>
              </div>
            </div>
            <div class="p-4 rounded-lg bg-purple-900/20 border border-purple-700/30">
              <div class="font-semibold mb-2">The Curious Forge HQ</div>
              <div class="text-sm text-slate-300 space-y-1">
                <div>123 Science Ave</div>
                <div>Innovation Ward, Education District</div>
                <div>Bangkok 10120</div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right: Contact Form + FAQ -->
        <div class="space-y-6">
          <!-- Contact Form -->
          <div class="card">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-violet-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold">{{ safeT('contact.form.title') }}</h2>
                <p class="text-sm text-slate-400">{{ safeT('contact.form.subtitle') }}</p>
              </div>
            </div>

            <form class="space-y-4" @submit.prevent="handleSubmit">
              <div class="grid md:grid-cols-2 gap-4">
                <InputField
                  id="contact-name"
                  v-model="form.name"
                  :label="safeT('contact.form.name')"
                  :placeholder="safeT('contact.form.namePlaceholder')"
                />
                <InputField
                  id="contact-email"
                  v-model="form.email"
                  :label="safeT('contact.form.email')"
                  type="email"
                  :placeholder="safeT('contact.form.emailPlaceholder')"
                />
              </div>

              <div class="space-y-2">
                <label for="contact-topic" class="text-sm text-slate-300">{{ safeT('contact.form.topic') }}</label>
                <input
                  id="contact-topic"
                  v-model="form.topic"
                  :placeholder="safeT('contact.form.topicPlaceholder')"
                  class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400"
                />
              </div>

              <div class="space-y-2">
                <label for="contact-message" class="text-sm text-slate-300">{{ safeT('contact.form.message') }}</label>
                <textarea
                  id="contact-message"
                  v-model="form.message"
                  rows="4"
                  :placeholder="safeT('contact.form.messagePlaceholder')"
                  class="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-violet-500 text-slate-100 placeholder-slate-400"
                />
              </div>

              <div class="flex gap-3">
                <button type="submit" class="btn-primary flex-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  {{ safeT('contact.form.submit') }}
                </button>
                <button type="button" class="btn-ghost" @click="resetForm">
                  {{ safeT('contact.form.reset') }}
                </button>
              </div>
            </form>
          </div>

          <!-- FAQ Section -->
          <div class="card bg-blue-900/10 border-blue-700/20">
            <div class="flex items-center gap-3 mb-4">
              <div class="p-2 rounded-lg bg-blue-600/20">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 class="text-lg font-semibold">{{ safeT('contact.faq.title') }}</h2>
                <p class="text-sm text-slate-400">{{ safeT('contact.faq.subtitle') }}</p>
              </div>
            </div>

            <div class="space-y-4">
              <div class="p-4 rounded-lg bg-blue-900/30 border border-blue-700/30">
                <h3 class="font-semibold text-blue-200 mb-2">{{ safeT('contact.faq.q1.question') }}</h3>
                <p class="text-sm text-slate-300">{{ safeT('contact.faq.q1.answer') }}</p>
              </div>

              <div class="p-4 rounded-lg bg-emerald-900/30 border border-emerald-700/30">
                <h3 class="font-semibold text-emerald-200 mb-2">{{ safeT('contact.faq.q2.question') }}</h3>
                <p class="text-sm text-slate-300">{{ safeT('contact.faq.q2.answer') }}</p>
              </div>

              <div class="p-4 rounded-lg bg-purple-900/30 border border-purple-700/30">
                <h3 class="font-semibold text-purple-200 mb-2">{{ safeT('contact.faq.q3.question') }}</h3>
                <p class="text-sm text-slate-300">{{ safeT('contact.faq.q3.answer') }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
import { reactive } from 'vue'
import InputField from '~/components/InputField.vue'
import Toast from '~/components/Toast.vue'

const { t } = useI18n()

// Safe translation helper: if a translation key is missing and i18n
// returns the raw key (e.g. "contact.title"), convert dots to
// spaces and title-case the result so the UI looks presentable.
const safeT = (key: string) => {
  try {
    const v = t(key)
    if (!v || v === key) {
      // remove leading/trailing dots, replace dots with spaces, title-case
      return key.replace(/^\.+|\.+$/g, '').split('.').join(' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
    }
    return v
  } catch (e) {
    return key.split('.').join(' ').replace(/\b\w/g, (c: string) => c.toUpperCase())
  }
}

const form = reactive({
  name: '',
  email: '',
  topic: '',
  message: ''
})

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  message: ''
})

function showToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  toast.type = type
  toast.message = message
  toast.show = true
}

function handleSubmit() {
  if (!form.name || !form.email || !form.message) {
    showToast('warning', t('contact.form.validation'))
    return
  }
  
  // Simulate sending
  showToast('success', t('contact.form.success'))
  resetForm()
}

function resetForm() {
  form.name = ''
  form.email = ''
  form.topic = ''
  form.message = ''
}
</script>
