<script setup>
const route = useRoute()

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
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

useSeoMeta({
  title: 'Macawoo — Feel The Woo',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
  ogTitle: 'Macawoo — Feel The Woo',
  ogDescription: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
  twitterCard: 'summary_large_image'
})
const isBlog = computed(() => route.path.startsWith('/blog'))
const footerBgColor = computed(() => isBlog.value ? 'bg-[#1D96B8]' : undefined)
const footerColor = computed(() => isBlog.value ? 'bg-brand-yellow-500' : undefined)
</script>

<template>
  <UApp>
    <AppHeader v-if="route.path !== '/careers'" />
    <main>
      <NuxtPage />
    </main>
    <AppFooter
      :bg-color="footerBgColor"
      :footer-color="footerColor"
    />
    <ChatWidget />
  </UApp>
</template>
