<template>
  <div class="flex items-center gap-2">
    <button
      v-for="loc in locales"
      :key="loc.code"
      @click="setLocale(loc.code)"
      :class="[
        'px-3 py-1 rounded-lg text-sm transition',
        locale === loc.code
          ? 'bg-violet-600 text-white'
          : 'bg-white/5 hover:bg-white/10'
      ]"
    >
      {{ loc.name }}
    </button>
  </div>
</template>

<script setup lang="ts">
const { locale, locales, setLocale } = useI18n()
</script>
