// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2025-10-24',

  runtimeConfig: {
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      plausibleDomain: process.env.PLAUSIBLE_DOMAIN || '',
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseKey: process.env.SUPABASE_KEY || ''
    }
  },

  typescript: {
    strict: true,
    shim: false
  },

  devtools: { enabled: true },

  css: ['~/assets/css/tailwind.css'],
  
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/i18n'
  ],

  i18n: {
    locales: [
      { code: 'th', name: 'ไทย', iso: 'th-TH' },
      { code: 'en', name: 'English', iso: 'en-US' }
    ],
    defaultLocale: 'th',
    strategy: 'no_prefix',
    vueI18n: './i18n.config.ts',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      redirectOn: 'root',
      fallbackLocale: 'th'
    }
  },

  vite: {
    optimizeDeps: {
      exclude: ['fsevents']
    }
  },

  build: {
    transpile: [],
  },

  app: {
    head: {
      title: 'The Curious Forge | วิทยาศาสตร์ด้วยมือ',
      meta: [
        { name: 'description', content: 'แพลตฟอร์มการเรียนรู้วิทยาศาสตร์เชิงทดลอง' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'theme-color', content: '#0e1320' },
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon.png' },
        { rel: 'apple-touch-icon', sizes: '192x192', href: '/icons/icon-192.png' }
      ],
      script: [
        {
          src: 'https://plausible.io/js/script.js',
          defer: true,
          'data-domain': process.env.PLAUSIBLE_DOMAIN || 'localhost'
        } as any
      ]
    },
    pageTransition: { 
      name: 'page', 
      mode: 'out-in' 
    },
    layoutTransition: { 
      name: 'layout', 
      mode: 'out-in' 
    }
  },
})
