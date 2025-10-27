
// nuxt.config.ts
import { defineNuxtConfig } from 'nuxt/config'

// Add PWA module type
declare module '@nuxt/schema' {
  interface NuxtConfig {
    pwa?: {
      registerType?: string
      manifest?: {
        name?: string
        short_name?: string
        description?: string
        theme_color?: string
        background_color?: string
        display?: string
        start_url?: string
        icons?: Array<{
          src: string
          sizes: string
          type: string
          purpose?: string
        }>
      }
      workbox?: {
        globPatterns?: string[]
      }
    }
  }
}

export default defineNuxtConfig({
  // 🔧 วันที่สำหรับ compatibility ของ Nitro (ตามที่ระบบเตือน)
  compatibilityDate: '2025-10-24',

  // TypeScript
  typescript: {
    strict: true,
    shim: false
  },

  // DevTools for development
  devtools: { enabled: true },

  // 🌙 ตั้งค่าโหมด Dark และ Tailwind
  css: ['~/assets/css/tailwind.css'],
  
  // ตั้งค่า PostCSS
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // ⚙️ โมดูลที่ใช้
  modules: [
    '@nuxtjs/tailwindcss',
      ['@vite-pwa/nuxt', {
        registerType: 'autoUpdate',
        manifest: {
          name: 'The Curious Forge',
          short_name: 'CuriousForge',
          description: 'วิทยาศาสตร์ด้วยมือ — คลังพิมพ์เขียวสำหรับการทดลอง',
          theme_color: '#0e1320',
          background_color: '#0e1320',
          display: 'standalone',
          start_url: '/',
          icons: [
            { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' },
            { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' },
            { src: '/icons/icon-512-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,webp}']
        }
      }]
  ],

    // 🛠️ Vite config
    vite: {
      optimizeDeps: {
        exclude: ['fsevents']
      }
    },

  // 🧱 การตั้งค่า build เพิ่มเติม (optional)
  build: {
    transpile: [],
  },

  // 🧭 ตั้งค่า meta ทั่วไปของแอป
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
      ],
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
