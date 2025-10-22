<template>
  <div class="min-h-screen flex flex-col bg-[radial-gradient(ellipse_at_top_left,_var(--bg-start),_var(--bg-end))] text-slate-100">
    <nav class="flex items-center justify-between p-4 max-w-6xl mx-auto w-full">
      <NuxtLink to="/" class="flex items-center gap-3">
        <img src="/assets/images/logo.svg" alt="logo" class="h-8" />
      </NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink to="/library" class="text-sm hover:underline">Library</NuxtLink>
        <NuxtLink to="/submit" class="text-sm">Submit</NuxtLink>
        <NuxtLink to="/profile" class="text-sm">Profile</NuxtLink>
      </div>
    </nav>

    <main class="flex-1 max-w-6xl mx-auto w-full px-4">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup lang="ts">
import AppFooter from '~/components/AppFooter.vue'
</script>
