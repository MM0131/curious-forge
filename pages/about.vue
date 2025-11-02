<template>
  <section class="py-14">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
  <h1 class="text-4xl font-extrabold mb-4">About Us</h1>
  <p class="text-xl text-slate-300">Hands-on science matters</p>
      </div>

      <!-- Mission -->
      <div class="card mb-8">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <span class="text-3xl">🎯</span>
          Our mission
        </h2>
        <p class="text-slate-300 leading-relaxed mb-4">
          The Curious Forge is a hands-on science and maker learning platform focused on giving everyone access to knowledge and skills through real projects.
        </p>
        <p class="text-slate-300 leading-relaxed">
          We believe the best learning happens by doing, experimenting and discovering. We collect practical, engaging blueprint projects so everyone can experience the wonder of science.
        </p>
      </div>

      <!-- Values -->
      <div class="grid md:grid-cols-3 gap-6 mb-8">
        <div class="card text-center">
          <div class="text-4xl mb-3">💡</div>
          <h3 class="font-semibold text-lg mb-2">Create</h3>
          <p class="text-sm text-slate-400">Encourage creativity and innovation</p>
        </div>
        <div class="card text-center">
          <div class="text-4xl mb-3">🤝</div>
          <h3 class="font-semibold text-lg mb-2">Share</h3>
          <p class="text-sm text-slate-400">Open to anyone who wants to learn</p>
        </div>
        <div class="card text-center">
          <div class="text-4xl mb-3">🚀</div>
          <h3 class="font-semibold text-lg mb-2">Grow</h3>
          <p class="text-sm text-slate-400">Continuously develop skills and knowledge</p>
        </div>
      </div>

      <!-- Story -->
      <div class="card bg-gradient-to-br from-violet-900/20 to-indigo-900/20 border-violet-700/20">
        <h2 class="text-2xl font-bold mb-4 flex items-center gap-3">
          <span class="text-3xl">📖</span>
          Our story
        </h2>
        <div class="space-y-4 text-slate-300 leading-relaxed">
          <p>
            The Curious Forge began from a passion for science and experimentation, built by people who believe science shouldn't be intimidating or boring — it should be fun and accessible to everyone.
          </p>
          <p>
            We collect interesting science and engineering projects from around the world — from lemon batteries to DIY telescopes — so learners can gain real, hands-on experience.
          </p>
          <p>
            Today, The Curious Forge is a community of explorers, makers and lifelong learners sharing knowledge, experience and inspiration.
          </p>
        </div>
      </div>

      <!-- CTA -->
      <div class="mt-8 text-center">
  <h3 class="text-xl font-semibold mb-4">Ready to start your science adventure?</h3>
        <div class="flex gap-4 justify-center flex-wrap">
          <NuxtLink to="/library" class="btn-primary">
            Browse projects
          </NuxtLink>
          <NuxtLink to="/submit" class="btn-primary bg-white/6">
            Submit your idea
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
useSeoMeta({
  title: 'About — The Curious Forge',
  description: 'The Curious Forge is a hands-on science and maker learning platform focused on giving everyone access to knowledge and skills through real projects.'
})
</script>

