import { fileURLToPath } from 'node:url'
import { defineNuxtConfig } from 'nuxt/config'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxt/image',
    '@nuxtjs/seo'
  ],

  devtools: {
    enabled: true
  },

  css: ['~/assets/css/main.css'],

  site: {
    url: process.env.NUXT_PUBLIC_SITE_URL || 'https://www.macawoo.in',
    name: 'Macawoo',
    description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
    defaultLocale: 'en'
  },

  ui: {
    theme: {
      colors: ['primary', 'secondary']
    }
  },

  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'
    }
  },

  routeRules: {
    '/': { prerender: true },
    // Admin area is client-rendered SPA. Prerendering the SPA shells ensures
    // Cloudflare Pages serves them directly, avoiding 404s.
    '/admin': { ssr: false },
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare-pages',
    alias: {
      'unenv/runtime/polyfill/process': fileURLToPath(new URL('./app/compat/process.mjs', import.meta.url))
    },
    prerender: {
      crawlLinks: true,
      routes: ['/admin', '/admin/login', '/robots.txt', '/sitemap.xml']
    }
  },

  eslint: {
    config: {
      stylistic: {
        commaDangle: 'never',
        braceStyle: '1tbs'
      }
    }
  },

  ogImage: {
    enabled: false
  },

  robots: {
    disallow: ['/admin', '/admin/*']
  },

  // nuxt-schema-org (bundled in @nuxtjs/seo) ships a broken UnheadSchemaOrg
  // import that 500s under the cloudflare runtime. Disable it and inject
  // Organization + WebSite JSON-LD manually in app.vue instead.
  schemaOrg: {
    enabled: false
  },

  sitemap: {
    exclude: ['/admin/**']
  }
})
