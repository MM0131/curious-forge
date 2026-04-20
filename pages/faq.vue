<template>
  <section class="py-14">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="text-center mb-12">
        <div class="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-600 to-teal-600 mb-6">
          <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
  <h1 class="text-4xl font-extrabold mb-4">Frequently Asked Questions</h1>
  <p class="text-xl text-slate-300">Answers to common questions</p>
      </div>

      <!-- FAQ Items -->
      <div class="space-y-4">
        <!-- FAQ 1 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(1)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">What is The Curious Forge?</h3>
              <p v-if="openFaq === 1" class="text-slate-300 leading-relaxed">
                The Curious Forge is an online platform that collects engaging science and engineering project blueprints so anyone can learn and build projects on their own.
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 1 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 2 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(2)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">Who are these projects for?</h3>
              <p v-if="openFaq === 2" class="text-slate-300 leading-relaxed">
                Our projects are for everyone — students, teachers, parents, and curious learners. We provide projects across difficulty levels.
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 2 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 3 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(3)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">Are the materials easy to find?</h3>
              <p v-if="openFaq === 3" class="text-slate-300 leading-relaxed">
                Yes — we choose projects that use inexpensive, commonly available materials, often household items or things from hardware stores.
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 3 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 4 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(4)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">Are these projects safe?</h3>
              <p v-if="openFaq === 4" class="text-slate-300 leading-relaxed">
                Safety is important. Every project includes warnings and precautions. For potentially risky projects, adult supervision and protective equipment are recommended.
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 4 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 5 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(5)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">Can I submit project ideas?</h3>
              <p v-if="openFaq === 5" class="text-slate-300 leading-relaxed">
                Absolutely — submit your idea via the Submit page or email us at ideas@curiousforge.edu
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 5 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>

        <!-- FAQ 6 -->
        <div class="card hover:bg-white/7 transition">
          <button
            class="w-full text-left flex items-start justify-between gap-4"
            @click="toggleFaq(6)"
          >
            <div>
              <h3 class="font-semibold text-lg mb-2">Is there a cost?</h3>
              <p v-if="openFaq === 6" class="text-slate-300 leading-relaxed">
                No — The Curious Forge is free for everyone. All blueprints remain freely accessible.
              </p>
            </div>
            <svg
              class="w-6 h-6 flex-shrink-0 transition-transform"
              :class="{ 'rotate-180': openFaq === 6 }"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Still have questions CTA -->
      <div class="mt-12 card bg-gradient-to-br from-emerald-900/20 to-teal-900/20 border-emerald-700/20 text-center">
        <h3 class="text-xl font-semibold mb-4">Still have questions?</h3>
        <p class="text-slate-300 mb-6">We're here to help!</p>
        <NuxtLink to="/contact" class="btn-primary">
          Contact us
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const openFaq = ref<number | null>(null)

function toggleFaq(id: number) {
  openFaq.value = openFaq.value === id ? null : id
}

useSeoMeta({
  title: 'FAQ - The Curious Forge',
  description: 'Answers to common questions about The Curious Forge and our science projects.'
})
</script>

