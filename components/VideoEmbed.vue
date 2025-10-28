<template>
  <div v-if="embedUrl" class="video-embed rounded-xl overflow-hidden shadow-lg">
    <iframe
      :src="embedUrl"
      :title="title || 'Video'"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      class="w-full aspect-video border-0"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
  videoUrl: string
  title?: string
}>()

// Convert YouTube/Vimeo URL to embed URL
const embedUrl = computed(() => {
  const url = props.videoUrl.trim()
  
  // YouTube patterns
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/)
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?rel=0`
  }
  
  // Vimeo pattern
  const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}`
  }
  
  // Already an embed URL or unsupported
  if (url.includes('youtube.com/embed') || url.includes('player.vimeo.com')) {
    return url
  }
  
  return ''
})
</script>

<style scoped>
.video-embed {
  background: rgba(0, 0, 0, 0.3);
}
</style>
