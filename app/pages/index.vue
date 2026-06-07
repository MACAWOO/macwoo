<script setup lang="ts">
import { projects } from '~/data/portfolio'

useSeoMeta({
  title: 'Macawoo — Feel The Woo',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
})

const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  if (containerRef.value) {
    const cards = containerRef.value.querySelectorAll('.reveal-card')
    cards.forEach((card) => observer.observe(card))
  }
})
</script>

<template>
  <div>
    <!-- Hero -->
    <PageHero
      title-html="FEEL THE <span class=&quot;text-brand-yellow-500&quot;>WOO</span>"
      image="/Images/hero.png"
      description="From strategy to storytelling, we create brands, campaigns, and content that don't just look good but perform, connect, and grow."
    />

    <!-- About Section -->
    <section class="bg-[#1D96B8] py-16 md:py-20">
      <div class="max-w-[1266px] mx-auto px-6 md:px-8">
        <div class="flex flex-col md:flex-row gap-12 md:gap-20 items-start">

          <!-- Left column -->
          <div class="md:w-[340px] shrink-0 flex flex-col gap-6">
            <!-- ABOUT US label -->
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-[#E8F600] inline-block shrink-0"></span>
              <span
                class="text-[#E8F600] text-xs font-semibold uppercase tracking-[0.18em]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >About Us</span>
            </div>

            <!-- Yellow circle logo -->
            <div>
              <img
                src="/Images/Logo.png"
                alt="Macawoo logo"
                class="w-[140px] h-[140px] object-contain"
              >
            </div>

            <!-- Tagline below logo -->
            <p
              class="text-[#E8F600] text-sm leading-relaxed max-w-[260px]"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              We love to create, we love to solve, we love to collaborate, and we love to turn amazing ideas into reality. We're here to partner with you through every step of the process.
            </p>
          </div>

          <!-- Right column – statement copy -->
          <div class="flex-1 flex items-center md:pt-8">
            <p
              class="text-white text-[28px] md:text-[36px] lg:text-[42px] font-semibold leading-[1.25]"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              At Macawoo, we create brands that connect, campaigns that perform, and stories that leave a lasting impression. Through branding, marketing, and storytelling, we help businesses stand out, stay relevant, and grow with purpose.
            </p>
          </div>

        </div>
      </div>
    </section>


    <!-- What We Do -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-[1201px] mx-auto px-6 md:px-0">

        <!-- Title — Fredoka 48px / 500 weight per Figma -->
        <h2
          class="text-center text-[#1D96B8] text-[36px] md:text-[48px] leading-[58px] font-medium mb-[63px]"
          style="font-family: 'Fredoka', sans-serif;"
        >
          What We Do
        </h2>

        <!-- Cards — equal width, fixed 492px height, ~13px gap -->
        <div
          ref="containerRef"
          class="grid grid-cols-1 md:grid-cols-3 gap-[13px]"
        >

          <!-- Branding & Design -->
          <NuxtLink
            to="/services/branding-design"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 0ms;"
          >
            <img
              src="/Images/Branding.jpeg"
              alt="Branding & Design"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <!-- gradient starts at 39.84% from top -->
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            ></div>
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            ></div>
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Branding</span><br>&amp; Design
              </p>
            </div>
          </NuxtLink>

          <!-- Digital Marketing -->
          <NuxtLink
            to="/services/digital-marketing"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 150ms;"
          >
            <img
              src="/Images/Digital Marketing.jpeg"
              alt="Digital Marketing"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            ></div>
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            ></div>
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Digital</span><br>Marketing
              </p>
            </div>
          </NuxtLink>

          <!-- Video Production -->
          <NuxtLink
            to="/services/video-production"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 300ms;"
          >
            <img
              src="/Images/Video Production.jpeg"
              alt="Video Production"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            ></div>
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            ></div>
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Video</span><br>Production
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Client Logos -->
        <div class="mt-16 md:mt-24">
          <ClientLogos />
        </div>
      </div>
    </section>

    <!-- Featured Work -->
    <FeaturedWork />

    <!-- Our Approach -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="md:w-1/3">
            <p class="text-brand-yellow-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Our Approach
            </p>
            <h2 class="text-3xl md:text-4xl font-bold text-brand-dark">
              How we turn ideas into impact
            </h2>
          </div>
          <div class="md:w-2/3 grid sm:grid-cols-2 gap-8">
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                01
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Think
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We start with deep discovery — understanding your brand, your audience, and your goals before any creative work begins.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                02
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Focus
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We define the strategy — narrowing in on what will genuinely move the needle and align with your business objectives.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                03
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Create
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We build — crafting every visual, word, and interaction with intentionality and craft that reflects your brand at its best.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                04
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Deliver
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We launch, measure, and optimise — ensuring the work performs in the real world, not just in a presentation deck.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Macawoo -->
    <WhyMacawoo />

    <!-- CTA -->
    <section class="py-24 bg-brand-dark relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <img
          src="/Images/upscale_image_quality_2K_202606031120.jpeg"
          alt=""
          class="w-full h-full object-cover"
        >
      </div>
      <div class="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h2 class="text-3xl md:text-5xl font-bold text-white leading-snug mb-6">
          Connect your ideas into<br>
          <span class="text-brand-yellow-500">successful businesses.</span>
        </h2>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow-500 text-brand-dark font-bold rounded-full text-sm hover:bg-brand-yellow-400 transition-colors"
        >
          Get Started ×
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
