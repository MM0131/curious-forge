<template>
  <div class="blueprint-card card hover:bg-white/7 hover:shadow-xl hover:scale-[1.02] hover:border-white/20 transition-all duration-300">
    <div class="image-wrapper overflow-hidden rounded-xl mb-4">
      <img v-if="cover" :src="cover" alt="" class="w-full h-44 object-cover transition-transform duration-500 hover:scale-110" />
    </div>
    <h3 class="text-lg font-semibold leading-snug">{{ title }}</h3>
    <p class="mt-1 text-sm text-slate-300 line-clamp-2">{{ subtitle }}</p>

    <div class="mt-4 flex items-center gap-3 text-xs text-slate-300 flex-wrap">
      <span class="tag px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">{{ time }}</span>
      <span class="tag px-2 py-1 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">{{ people }}</span>
      <span class="tag px-2 py-1 rounded-lg bg-emerald-600/15 border border-emerald-500/20 text-emerald-200 hover:bg-emerald-600/25 transition-colors">{{ level }}</span>
    </div>

    <div class="mt-5">
      <NuxtLink :to="to" class="btn-primary inline-flex items-center gap-2 group">
        ดูรายละเอียด
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  subtitle: string
  time: string
  people: string
  level: string
  cover?: string
  to: string
}>();
</script>

<style scoped>
.blueprint-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.image-wrapper {
  position: relative;
}

.image-wrapper::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(0,0,0,0.3), transparent);
  opacity: 0;
  transition: opacity 0.3s;
}

.blueprint-card:hover .image-wrapper::after {
  opacity: 1;
}
</style>
