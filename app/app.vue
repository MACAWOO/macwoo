<script setup>
const route = useRoute()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
    { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
    { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Fredoka:wght@400;500;600&display=swap'
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Site-wide defaults. Per-page useSeoMeta() supplies title/description (and via
// nuxt-seo-utils, their og: equivalents). We intentionally do NOT set title or
// description here, otherwise the app-level og:title/og:description would pin the
// global value on every route. titleTemplate brands any page title lacking it.
useHead({
  titleTemplate: title => (title && title.includes('Macawoo')) ? title : (title ? `${title} — Macawoo` : 'Macawoo — Feel The Woo')
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Macawoo',
  ogImage: '/og-image.png',
  twitterCard: 'summary_large_image',
  twitterImage: '/og-image.png'
})

// Organization + WebSite structured data (JSON-LD). Injected manually because the
// bundled nuxt-schema-org module is disabled (broken UnheadSchemaOrg import).
const siteUrl = 'https://www.macawoo.in'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'Organization',
            '@id': `${siteUrl}/#organization`,
            'name': 'Macawoo',
            'url': siteUrl,
            'logo': `${siteUrl}/icon-512.png`,
            'email': 'macawooofficial@gmail.com',
            'description': 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            'url': siteUrl,
            'name': 'Macawoo',
            'publisher': { '@id': `${siteUrl}/#organization` }
          }
        ]
      })
    }
  ]
})

const isBlog = computed(() => route.path.startsWith('/blog'))
const isContact = computed(() => route.path === '/contact')
const footerBgColor = computed(() => {
  if (isBlog.value) return 'bg-[#1D96B8]'
  if (isContact.value) return 'bg-brand-yellow-500'
  return undefined
})
const footerColor = computed(() => {
  if (isBlog.value) return 'bg-brand-yellow-500'
  if (isContact.value) return 'bg-[#1D96B8]'
  return undefined
})
const isAdmin = computed(() => route.path.startsWith('/admin'))
</script>

<template>
  <UApp>
    <AppHeader v-if="route.path !== '/careers' && !isAdmin" />
    <main>
      <NuxtPage />
    </main>
    <AppFooter
      v-if="!isAdmin"
      :bg-color="footerBgColor"
      :footer-color="footerColor"
    />
    <ChatWidget v-if="!isAdmin" />
  </UApp>
</template>
