import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  ssr: false,
  app: {
    head: {
      title: 'The Curious Forge',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ]
    }
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@vite-pwa/nuxt'
  ],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
    config: {
      theme: {
        extend: {
          colors: {
            primary: {
              DEFAULT: '#4f46e5'
            }
          }
        }
      }
    }
  },
  pwa: {
    manifest: {
      name: 'The Curious Forge',
      short_name: 'CuriousForge',
      lang: 'th',
      theme_color: '#0e1320'
    },
    workbox: {
      navigateFallback: '/'
    }
  }
})
