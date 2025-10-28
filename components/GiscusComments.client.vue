<template>
  <div ref="giscusContainer" class="giscus-wrapper mt-8"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{
  repo: string           // e.g. "owner/repo"
  repoId: string         // Get from https://giscus.app
  category: string       // e.g. "Announcements" or "General"
  categoryId: string     // Get from https://giscus.app
  mapping?: string       // default: "pathname"
  theme?: string         // default: "dark"
}>()

const giscusContainer = ref<HTMLDivElement>()

function loadGiscus() {
  if (!giscusContainer.value) return
  
  // Clear existing script if any
  giscusContainer.value.innerHTML = ''
  
  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.dataset.repo = props.repo
  script.dataset.repoId = props.repoId
  script.dataset.category = props.category
  script.dataset.categoryId = props.categoryId
  script.dataset.mapping = props.mapping || 'pathname'
  script.dataset.strict = '0'
  script.dataset.reactionsEnabled = '1'
  script.dataset.emitMetadata = '0'
  script.dataset.inputPosition = 'top'
  script.dataset.theme = props.theme || 'dark'
  script.dataset.lang = 'th'
  script.dataset.loading = 'lazy'
  script.crossOrigin = 'anonymous'
  script.async = true
  
  giscusContainer.value.appendChild(script)
}

onMounted(() => {
  loadGiscus()
})

// Reload when theme changes (optional)
watch(() => props.theme, () => {
  loadGiscus()
})
</script>

<style scoped>
.giscus-wrapper {
  /* Ensure Giscus iframe styles match our dark theme */
  min-height: 200px;
}
</style>
