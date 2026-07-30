<script setup>
const route = useRoute()
const siteUrl = 'https://www.macawoo.co'

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
      href: 'https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700&family=Fredoka:wght@400;500;600&display=swap',
      media: 'print',
      onload: "this.media='all'"
    },
    {
      rel: 'canonical',
      href: computed(() => {
        const cleanPath = route.path === '/' ? '' : route.path.replace(/\/$/, '')
        return `${siteUrl}${cleanPath}`
      })
    }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

// Site-wide defaults.
useHead({
  titleTemplate: title => (title && title.includes('Macawoo')) ? title : (title ? `${title} — Macawoo` : 'Macawoo — Creative and Strategic Branding Agency')
})

useSeoMeta({
  ogType: 'website',
  ogSiteName: 'Macawoo — Creative and Strategic Branding Agency',
  ogImage: `${siteUrl}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogLocale: 'en_US',
  ogUrl: computed(() => {
    const cleanPath = route.path === '/' ? '' : route.path.replace(/\/$/, '')
    return `${siteUrl}${cleanPath}`
  }),
  twitterCard: 'summary_large_image',
  twitterImage: `${siteUrl}/og-image.png`
})

// Organization + ProfessionalService + WebSite structured data (JSON-LD)
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': ['Organization', 'ProfessionalService'],
            '@id': `${siteUrl}/#organization`,
            'name': 'Macawoo',
            'url': siteUrl,
            'logo': `${siteUrl}/icon-512.png`,
            'email': 'info@macawoo.co',
            'description': 'Macawoo is a full-service creative and strategic branding agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
            'knowsAbout': [
              'Creative and Strategic Branding Agency',
              'Brand Strategy',
              'Creative Direction',
              'Visual Identity Design',
              'Digital Marketing',
              'Video Production'
            ],
            'sameAs': [
              'https://www.linkedin.com/company/macawoo',
              'https://twitter.com/macawoo',
              'https://www.instagram.com/macawooofficial'
            ]
          },
          {
            '@type': 'WebSite',
            '@id': `${siteUrl}/#website`,
            'url': siteUrl,
            'name': 'Macawoo — Creative and Strategic Branding Agency',
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
  if (isBlog.value) return 'bg-[#0596B8]'
  if (isContact.value) return 'bg-brand-yellow-500'
  return undefined
})
const footerColor = computed(() => {
  if (isBlog.value) return 'bg-brand-yellow-500'
  if (isContact.value) return 'bg-[#0596B8]'
  return undefined
})
const isAdmin = computed(() => route.path.startsWith('/admin'))

// Hide navbar on detail/inner pages (blog, portfolio, case-studies slug pages)
const isInnerPage = computed(() => {
  const segments = route.path.replace(/\/$/, '').split('/').filter(Boolean)
  const innerSections = ['blog', 'portfolio', 'case-studies']
  return segments.length >= 2 && innerSections.includes(segments[0])
})
</script>

<template>
  <UApp>
    <div id="original-site">
      <AppHeader v-if="route.path !== '/careers' && !isAdmin && !isInnerPage" />
      <main>
        <NuxtPage />
      </main>
      <AppFooter
        v-if="!isAdmin"
        :bg-color="footerBgColor"
        :footer-color="footerColor"
      />
      <LazyChatWidget v-if="!isAdmin" />
    </div>
    <LazyMaskRevealCursor v-if="!isAdmin" />
  </UApp>
</template>
