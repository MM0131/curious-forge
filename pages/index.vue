<template>
  <section class="py-16">
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="inline-block px-5 py-3 rounded-2xl bg-violet-700/20 backdrop-blur-sm text-4xl md:text-5xl font-extrabold">
        Curious Forge
      </h1>

  <p class="mt-6 text-3xl md:text-4xl font-extrabold">{{ translateOr('home.tagline','Explore hands-on projects — tinker boldly and learn by doing') }}</p>
  <p class="mt-3 text-slate-300">{{ translateOr('home.subtitle','Projects, experiments, and tutorials for curious makers') }}</p>

      <div class="mt-8 flex items-center justify-center gap-4">
  <NuxtLink to="/library" class="btn-primary">{{ translateOr('home.explore','Explore') }}</NuxtLink>
  <NuxtLink to="/submit" class="btn-ghost">{{ translateOr('home.submitIdea','Submit idea') }}</NuxtLink>
      </div>

  <h2 class="mt-14 text-xl font-semibold">{{ translateOr('home.featuredProjects','Featured projects') }}</h2>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n()
const translateOr = (key: string, fallback: string) => {
  const v = t(key)
  return v === key ? fallback : v
}
</script>
