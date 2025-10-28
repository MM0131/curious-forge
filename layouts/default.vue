<template>
  <div class="min-h-screen flex flex-col text-slate-100">
    <OfflineBanner />
    <!-- Top bar -->
    <header class="w-full">
      <nav class="container mx-auto flex items-center justify-between py-6 px-4">
        <NuxtLink to="/" class="px-3 py-1 rounded-lg bg-violet-700/30 hover:bg-violet-600/40 transition">
          <span class="font-semibold tracking-wide">Curious Forge</span>
        </NuxtLink>

        <div class="flex items-center gap-6 text-sm">
          <NuxtLink class="hover:opacity-80" to="/library">Library</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/submit">Submit</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/profile">Profile</NuxtLink>
        </div>
      </nav>
    </header>

    <!-- Page body -->
    <main class="flex-1 container mx-auto px-4">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="border-t border-white/10">
      <div class="container mx-auto px-4 py-6 flex items-center justify-between text-slate-300 text-sm">
        <div>© The Curious Forge • ทีมทดลอง</div>
        <div class="flex gap-6">
          <NuxtLink class="hover:opacity-80" to="/about">About</NuxtLink>
          <NuxtLink class="hover:opacity-80" to="/contact">Contact</NuxtLink>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import OfflineBanner from '~/components/OfflineBanner.client.vue'
</script>
