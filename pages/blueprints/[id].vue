<template>
  <section class="py-8">
    <div class="max-w-4xl mx-auto">
      <div v-if="bp">
        <div class="flex flex-col md:flex-row gap-8 items-start">
          <img v-if="bp.image" :src="bp.image" alt="" class="w-64 h-64 object-contain rounded-xl shadow mb-4 md:mb-0" />
          <div class="flex-1">
            <h1 class="text-3xl font-bold">{{ bp.title }}</h1>
            <p class="text-sm text-slate-300 mt-2">{{ bp.category }} • {{ bp.difficulty }} • {{ bp.time }}</p>
            <p v-if="bp.description" class="mt-4 text-base text-slate-200">{{ bp.description }}</p>

            <!-- Video Section (if available) -->
            <div v-if="bp.videoUrl" class="mt-6">
              <VideoEmbed :video-url="bp.videoUrl" :title="bp.title" />
            </div>

            <div class="mt-6 flex gap-3 flex-wrap">
              <button class="btn-primary" @click="printBlueprint">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                พิมพ์
              </button>
              <button class="btn-primary bg-white/6" @click="shareBlueprint">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                แชร์
              </button>
              <button :class="['btn-primary', isSaved ? '' : 'bg-white/6']" @click="toggleSave">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path v-if="!isSaved" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                {{ isSaved ? 'บันทึกแล้ว' : 'บันทึกโปรเจกต์' }}
              </button>
            </div>
          </div>
        </div>

        <section class="mt-6 card">
          <h2 class="font-semibold">วัตถุประสงค์</h2>
          <p class="text-slate-300 mt-2">{{ bp.purpose }}</p>
        </section>

        <section v-if="bp.sciencePrinciple" class="mt-4 card">
          <h2 class="font-semibold">หลักการวิทยาศาสตร์</h2>
          <p class="text-slate-300 mt-2">{{ bp.sciencePrinciple }}</p>
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

        <section v-if="bp.funFacts && bp.funFacts.length" class="mt-4 card bg-indigo-900/20 border-indigo-700/20">
          <h2 class="font-semibold text-indigo-300">เกร็ดความรู้</h2>
          <ul class="list-disc list-inside text-slate-300">
            <li v-for="fact in bp.funFacts" :key="fact">{{ fact }}</li>
          </ul>
        </section>

        <section class="mt-4 card bg-rose-900/20 border-rose-700/20">
          <h2 class="font-semibold text-rose-300">คำเตือน</h2>
          <p class="text-slate-300">{{ bp.warnings }}</p>
        </section>

        <!-- Giscus Comments Section -->
        <section class="mt-8">
          <h2 class="text-2xl font-bold mb-4">💬 แสดงความคิดเห็น</h2>
          <GiscusComments
            repo="MM0131/curious-forge"
            repo-id="R_kgDONgaPAg"
            category="General"
            category-id="DIC_kwDONgaPAs4Clb2G"
            mapping="pathname"
            theme="dark"
          />
        </section>
      </div>
      <div v-else>
        <LoadingSpinner size="lg" text="กำลังโหลดข้อมูล..." />
      </div>
    </div>
    
    <Toast 
      v-if="toast.show" 
      :type="toast.type" 
      :message="toast.message" 
      @close="toast.show = false"
    />
    
    <Modal v-model="showShareModal">
      <template #header>
        <h3 class="text-xl font-bold">แชร์โปรเจกต์</h3>
      </template>
      <template #body>
        <div class="space-y-4">
          <p class="text-slate-300">แชร์โปรเจกต์นี้ให้เพื่อนของคุณ:</p>
          <div class="flex gap-2">
            <input 
              :value="shareUrl" 
              readonly 
              class="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm"
            />
            <button @click="copyShareUrl" class="btn-primary">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </button>
          </div>
        </div>
      </template>
      <template #footer>
        <button @click="showShareModal = false" class="btn-primary bg-white/6">ปิด</button>
      </template>
    </Modal>
  </section>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed, ref, reactive } from 'vue'
import type { Blueprint } from '~/types/blueprint'
import blueprintsData from '@/assets/data/blueprints.json'
import Toast from '~/components/Toast.vue'
import Modal from '~/components/Modal.vue'
import LoadingSpinner from '~/components/LoadingSpinner.vue'
import GiscusComments from '~/components/GiscusComments.client.vue'
import VideoEmbed from '~/components/VideoEmbed.vue'
import { useSaved } from '~/composables/useSaved'
import { useAnalytics } from '~/composables/useAnalytics'
import { useRuntimeConfig } from '#app'

const route = useRoute()
const blueprints = blueprintsData as Blueprint[]

// Normalize id from route (string | string[])
const currentId = computed(() => {
  const raw = route.params.id
  return Array.isArray(raw) ? raw[0] : String(raw)
})

const bp = computed(() => blueprints.find(x => x.id === currentId.value))

const { isSaved: _isSaved, toggle, save } = useSaved()
const isSaved = computed(() => (bp.value ? _isSaved(bp.value.id) : false))
const { track } = useAnalytics()
const config = useRuntimeConfig()

const toast = reactive({
  show: false,
  type: 'success' as 'success' | 'error' | 'warning' | 'info',
  message: ''
})

const showShareModal = ref(false)
const shareUrl = computed(() => {
  if (globalThis.window !== undefined) {
    return globalThis.window.location.href
  }
  return ''
})

function showToast(type: 'success' | 'error' | 'warning' | 'info', message: string) {
  toast.type = type
  toast.message = message
  toast.show = true
}

function toggleSave() {
  if (!bp.value) return
  track(isSaved.value ? 'unsave' : 'save', { id: bp.value.id })
  toggle(bp.value.id)
  if (_isSaved(bp.value.id)) showToast('success', 'บันทึกโปรเจกต์เรียบร้อยแล้ว! 🎉')
  else showToast('info', 'ลบออกจากรายการบันทึกแล้ว')
}

function shareBlueprint() {
  if (navigator.share && bp.value) {
    navigator.share({
      title: bp.value.title,
      text: bp.value.description || bp.value.purpose,
      url: globalThis.window.location.href
    }).then(() => {
      track('share', { id: bp.value!.id, method: 'web-share' })
      showToast('success', 'แชร์เรียบร้อย!')
    }).catch(() => {
      showShareModal.value = true
    })
  } else {
    if (bp.value) track('share', { id: bp.value.id, method: 'modal' })
    showShareModal.value = true
  }
}

function copyShareUrl() {
  navigator.clipboard.writeText(shareUrl.value).then(() => {
    if (bp.value) track('copy_link', { id: bp.value.id })
    showToast('success', 'คัดลอก URL เรียบร้อย! 📋')
    showShareModal.value = false
  }).catch(() => {
    showToast('error', 'ไม่สามารถคัดลอก URL ได้')
  })
}

function printBlueprint() {
  if (globalThis.window !== undefined) {
    if (bp.value) track('print', { id: bp.value.id })
    globalThis.window.print()
  }
}

// SEO: dynamic meta including OG/Twitter
const siteUrl = computed(() => (config.public as any).siteUrl as string)
const ogImage = computed(() => {
  const img = bp.value?.image || '/favicon.png'
  try {
    return new URL(img, siteUrl.value).toString()
  } catch {
    return img
  }
})

useSeoMeta({
  title: () => bp.value?.title || 'Blueprint Detail',
  ogTitle: () => bp.value?.title || 'Blueprint Detail',
  description: () => bp.value?.description || bp.value?.purpose || 'Blueprint description',
  ogDescription: () => bp.value?.description || bp.value?.purpose || 'Blueprint description',
  ogImage: () => ogImage.value,
  twitterCard: () => 'summary_large_image'
})
</script>

<style scoped>
@media print {
  /* Hide navigation, buttons, and modals when printing */
  button,
  .btn-primary {
    display: none !important;
  }

  /* Optimize layout for print */
  section {
    page-break-inside: avoid;
  }

  .card {
    border: 1px solid #333;
    box-shadow: none;
    page-break-inside: avoid;
  }

  /* Ensure good contrast for print */
  body {
    background: white;
    color: black;
  }

  h1, h2, h3, h4, h5, h6 {
    color: black;
  }

  p, li {
    color: #333;
  }

  img {
    max-width: 100%;
    page-break-inside: avoid;
  }
}
</style>
