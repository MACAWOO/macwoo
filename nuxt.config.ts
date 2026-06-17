import { defineNuxtConfig } from 'nuxt/config'

// Nitro injects `unenv/polyfill/process` as a side-effect import at the
// Cloudflare worker entry. unenv v2's polyfill wraps `process` in a Proxy whose
// `get` trap forwards reads using the Proxy itself as the `receiver`. unenv's
// Process class implements stdout/stderr/stdin as getters backed by private
// fields (`get stdout(){ return this.#stdout ??= ... }`); when the getter runs
// with the Proxy as `this` it throws "Cannot read private member #t from an
// object whose class did not declare it", which crashes the Function on publish.
// Nitro resolves this polyfill to an absolute path before user aliases apply,
// so we patch the module source at bundle time to forward reads against the
// real target object (the getter's home) instead of the Proxy.
function fixUnenvProcessPolyfill() {
  return {
    name: 'fix-unenv-process-polyfill',
    load(id: string) {
      if (!id.replace(/\\/g, '/').endsWith('unenv/dist/runtime/polyfill/process.mjs')) {
        return null
      }
      return `import processModule from "node:process";
const originalProcess = globalThis["process"];
globalThis.process = originalProcess ? new Proxy(originalProcess, {
  get(target, prop) {
    if (Reflect.has(target, prop)) {
      return Reflect.get(target, prop, target);
    }
    return Reflect.get(processModule, prop, processModule);
  }
}) : processModule;
export default globalThis.process;
`
    }
  }
}

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
    resendApiKey: process.env.RESEND_API_KEY || '',
    contactRecipientEmail: process.env.CONTACT_RECIPIENT_EMAIL || '',
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY || '',
    public: {
      supabaseUrl: process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co',
      supabaseKey: process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || '0x4AAAAAADmur0Me-uiKizSt'
    }
  },

  routeRules: {
    // Homepage hero/featured content comes from Supabase at request time.
    // Prerendering froze the hero image at build, so render it dynamically (SSR).
    '/': { prerender: false },
    // Admin area is client-rendered SPA. Prerendering the SPA shells ensures
    // Cloudflare Pages serves them directly, avoiding 404s.
    '/admin': { ssr: false },
    '/admin/**': { ssr: false }
  },

  compatibilityDate: '2025-01-15',

  nitro: {
    preset: 'cloudflare-pages',
    rollupConfig: {
      plugins: [fixUnenvProcessPolyfill()]
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
    exclude: ['/admin/**'],
    sources: [
      '/api/sitemap-urls'
    ]
  }
})
