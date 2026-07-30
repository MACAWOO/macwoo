<script setup lang="ts">
const props = defineProps<{ error: { statusCode: number, statusMessage?: string, message?: string } }>()

useHead({
  title: 'Page Not Found — Macawoo',
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})

function goHome() {
  clearError({ redirect: '/' })
}

function columnAlpha(i: number) {
  const center = 7
  const dist = Math.abs(i - center)
  return Math.max(0.12, 0.85 - dist * 0.11)
}

const helpfulLinks = [
  { label: 'Homepage', description: 'Return to the main page', to: '/' },
  { label: 'Branding & Design', description: 'Identity, positioning & strategy', to: '/services/branding-design' },
  { label: 'Digital Marketing', description: 'Performance & growth campaigns', to: '/services/digital-marketing' },
  { label: 'Video Production', description: 'Visual storytelling & films', to: '/services/video-production' },
  { label: 'Portfolio Showcase', description: 'Selected branding work', to: '/portfolio' },
  { label: 'Case Studies', description: 'Proven client transformations', to: '/case-studies' },
  { label: 'Blog & Insights', description: 'Articles on brand strategy', to: '/blog' },
  { label: 'Contact Us', description: 'Get in touch with our team', to: '/contact' }
]
</script>

<template>
  <div class="min-h-screen bg-brand-dark text-white relative overflow-hidden flex flex-col justify-between">
    <!-- Background yellow pillar graphics -->
    <div
      class="absolute inset-y-0 right-0 w-[55%] flex pointer-events-none opacity-20"
      aria-hidden="true"
    >
      <div
        v-for="i in 13"
        :key="i"
        class="flex-1"
        :style="`background: linear-gradient(to bottom, rgba(237,224,0,${columnAlpha(i)}) 0%, rgba(237,224,0,0) 95%)`"
      />
    </div>

    <!-- Container -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 py-10 w-full flex-1 flex flex-col">
      <!-- Header / Logo -->
      <div class="flex items-center justify-between pb-8 border-b border-white/10">
        <NuxtLink to="/" class="inline-block">
          <NuxtImg
            src="/Images/Logo.png"
            alt="Macawoo — Creative and Strategic Branding Agency"
            class="h-9 w-auto"
            format="webp"
          />
        </NuxtLink>
        <button
          class="px-5 py-2.5 bg-brand-yellow-500 text-brand-dark font-semibold text-xs rounded-full hover:bg-brand-yellow-400 transition-colors"
          @click="goHome"
        >
          Go Home
        </button>
      </div>

      <!-- Main content grid -->
      <div class="my-auto py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <!-- Error Heading -->
        <div class="lg:col-span-5 flex flex-col items-start">
          <span class="inline-block px-3.5 py-1 bg-brand-yellow-500/10 text-brand-yellow-500 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-brand-yellow-500/20">
            {{ props.error?.statusCode || 404 }} Error
          </span>
          <h1 class="text-4xl md:text-6xl font-fredoka font-medium leading-tight mb-4 text-white">
            Lost in the<br><span class="text-brand-yellow-500">Creative Space?</span>
          </h1>
          <p class="text-zinc-400 text-base mb-8 max-w-md">
            The page you are looking for might have been moved, renamed, or no longer exists. Let's get you back on track.
          </p>
          <button
            class="group inline-flex items-center gap-2.5 px-7 py-3.5 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full hover:bg-brand-yellow-400 transition-colors"
            @click="goHome"
          >
            Back to Homepage
            <UpRightArrow class="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>

        <!-- Helpful Navigation Links Grid -->
        <div class="lg:col-span-7">
          <h2 class="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
            Explore Popular Destinations
          </h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NuxtLink
              v-for="link in helpfulLinks"
              :key="link.to"
              :to="link.to"
              class="p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-brand-yellow-500/40 transition-all duration-300 group flex flex-col justify-between"
            >
              <div class="flex items-center justify-between mb-1">
                <span class="font-bold text-white group-hover:text-brand-yellow-500 transition-colors text-sm">
                  {{ link.label }}
                </span>
                <UpRightArrow class="w-3.5 h-3.5 text-zinc-500 group-hover:text-brand-yellow-500 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <span class="text-xs text-zinc-400">
                {{ link.description }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer note -->
    <div class="relative z-10 border-t border-white/10 py-6 text-center text-xs text-zinc-500">
      &copy; {{ new Date().getFullYear() }} Macawoo — Creative & Strategic Branding Agency. All rights reserved.
    </div>
  </div>
</template>
