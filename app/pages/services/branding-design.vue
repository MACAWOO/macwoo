<script setup lang="ts">
useSeoMeta({
  title: 'Branding & Design — Macawoo',
  description: 'We Don\'t Just Design. We Build Brands. Define your brand positioning, messaging, and direction.'
})

const prevTo = '/services/video-production'
const nextTo = '/services/digital-marketing'

const subServices = [
  { icon: '/Icons/Lightbulb@4x.png', title: 'Brand Strategy', description: 'Define your brand positioning, messaging, and direction to build a strong foundation for growth.' },
  { icon: '/Icons/Pencil%20Ruler@4x.png', title: 'Brand Identity', description: 'Create memorable visual identities that strengthen recognition, trust, and brand consistency.' },
  { icon: '/Icons/Package@4x.png', title: 'Packaging Design', description: 'Design impactful packaging that captures attention and enhances customer experience.' },
  { icon: '/Icons/Figma@4x.png', title: 'UI/UX Design', description: 'Craft intuitive digital experiences that improve usability, engagement, and customer satisfaction.' },
  { icon: '/Icons/Palette@4x.png', title: 'Corporate Design', description: 'Develop professional brand assets that ensure clear and consistent business communication.' },
  { icon: '/Icons/Brain@4x.png', title: 'Creative Design', description: 'Lead creative concepts and visual storytelling that bring your brand vision to life.' }
]

const steps = [
  { number: '01', title: 'Discover', description: 'Unearthing the core truth of your business.' },
  { number: '02', title: 'Define', description: 'Structuring the narrative and positioning.' },
  { number: '03', title: 'Design', description: 'Crafting the visual and verbal identity.' },
  { number: '04', title: 'Deliver', description: 'Launching the brand into the world.' }
]

const logos = [
  { src: '/Images/Client_Logo/le crown brown-01 1@2x.png', alt: 'Le Crown', h: 'h-[39px]' },
  { src: '/Images/Client_Logo/COLOR 2 1@2x.png', alt: 'Take My Family', h: 'h-[42px]' },
  { src: '/Images/Client_Logo/IMG_3097 1@2x.png', alt: 'TAB', h: 'h-[38px]' },
  { src: '/Images/Client_Logo/Twins Abroad Logo - Reel Cover Logo Overlay b&w 1@2x.png', alt: 'Twins Abroad', h: 'h-[50px]' },
  { src: '/Images/Client_Logo/Pink Label logo 1@2x.png', alt: 'Pinklabel', h: 'h-[45px]' },
  { src: '/Images/Client_Logo/Asset 1@500x 1@2x.png', alt: 'Piok English', h: 'h-[52px]' },
  { src: '/Images/Client_Logo/Asset 1@500x 2@2x.png', alt: 'Go German', h: 'h-[54px]' }
]
</script>

<template>
  <div class="bg-white">
    <!-- ═══════════════════════════════════════════
         HERO BANNER (386px)
         ═══════════════════════════════════════════ -->
    <section class="relative h-[300px] md:h-[386px] overflow-hidden">
      <!-- Background image + dark overlay -->
      <div class="absolute inset-0">
        <img
          src="/Images/Branding.jpeg"
          alt=""
          class="w-full h-full object-cover"
        >
        <div class="absolute inset-0 bg-black/40" />
      </div>

      <!-- Content -->
      <div class="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <p
          class="text-white text-[14px] md:text-[18px] font-normal tracking-wide mb-1"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          SERVICES
        </p>
        <h1
          class="text-[#F4ED18] text-[32px] md:text-[48px] leading-[58px] font-medium mb-2"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Branding &amp; Design
        </h1>
        <p
          class="text-white text-[14px] md:text-[18px] font-normal leading-[28px] max-w-[910px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          We Don't Just Design. We Build Brands.
        </p>
      </div>

      <!-- Left Arrow -->
      <NuxtLink
        :to="prevTo"
        class="absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        style="box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);"
      >
        <svg class="w-[18px] h-[18px] md:w-[22px] md:h-[22px] -scale-x-100" viewBox="0 0 12 12" fill="none">
          <path d="M0.0349998 9.348L1.305 10.74L7.879 4.679C7.243 6.979 7.854 9.432 9.285 11.506L10.744 10.175C8.797 7.436 8.738 3.803 11.303 1.462L10.186 0.238C7.621 2.579 4.009 2.189 1.458 0L0 1.331C1.934 2.945 4.322 3.777 6.67 3.355L0.0349998 9.348Z" fill="#141111" />
        </svg>
      </NuxtLink>

      <!-- Right Arrow -->
      <NuxtLink
        :to="nextTo"
        class="absolute right-4 md:right-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] rounded-full bg-white flex items-center justify-center hover:scale-105 transition-transform"
        style="box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);"
      >
        <svg class="w-[18px] h-[18px] md:w-[22px] md:h-[22px]" viewBox="0 0 12 12" fill="none">
          <path d="M0.0349998 9.348L1.305 10.74L7.879 4.679C7.243 6.979 7.854 9.432 9.285 11.506L10.744 10.175C8.797 7.436 8.738 3.803 11.303 1.462L10.186 0.238C7.621 2.579 4.009 2.189 1.458 0L0 1.331C1.934 2.945 4.322 3.777 6.67 3.355L0.0349998 9.348Z" fill="#141111" />
        </svg>
      </NuxtLink>
    </section>

    <!-- ═══════════════════════════════════════════
         SUB-SERVICES CARDS (Teal Background)
         ═══════════════════════════════════════════ -->
    <section class="bg-[#1D96B8] relative overflow-hidden pt-16 md:pt-20 pb-20 md:pb-24">
      <div class="max-w-[1120px] mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-x-[18px] gap-y-[28px]">
          <div
            v-for="s in subServices"
            :key="s.title"
            class="bg-white rounded-[10px] flex overflow-hidden h-auto md:h-[231px]"
          >
            <!-- Gradient left strip -->
            <div
              class="w-[60px] md:w-[78px] shrink-0 flex items-start justify-center pt-8 md:pt-9"
              style="background: linear-gradient(180deg, #F4ED18 0%, #1D96B8 100%); border-radius: 10px 0 0 10px;"
            >
              <img
                :src="s.icon"
                :alt="s.title"
                class="w-[34px] h-[34px] md:w-[40px] md:h-[40px] object-contain"
              >
            </div>
            <!-- Content -->
            <div class="flex-1 flex flex-col justify-center px-5 md:px-9 py-6 md:py-0">
              <h3
                class="text-[#1D96B8] text-[24px] md:text-[32px] font-bold leading-[38px] mb-3 md:mb-[19px]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ s.title }}
              </h3>
              <p
                class="text-black text-[15px] md:text-[18px] font-normal leading-[26px] md:leading-[28px]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                {{ s.description }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Floating M Badge -->
      <div
        class="hidden md:block absolute top-[280px] right-[80px] w-[82px] h-[83px] z-20"
        style="filter: drop-shadow(0px 4px 24px rgba(0, 0, 0, 0.25));"
      >
        <img
          src="/Images/Logo.png"
          alt="Macawoo"
          class="w-full h-full object-contain"
        >
        <!-- Yellow triangle pointer -->
        <div
          class="absolute -bottom-2 right-2 w-[22px] h-[22px] bg-[#F4ED18]"
          style="clip-path: polygon(50% 100%, 0 0, 100% 0); transform: rotate(136deg);"
        />
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CLIENT LOGO MARQUEE
         ═══════════════════════════════════════════ -->
    <section class="py-3 bg-white overflow-hidden relative">
      <!-- Fade edges -->
      <div class="absolute left-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div class="absolute right-0 top-0 bottom-0 w-20 md:w-32 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <!-- Scrolling logos -->
      <div class="flex animate-marquee items-center py-3">
        <!-- Repeat 3 sets for seamless loop -->
        <template v-for="set in 3" :key="set">
          <img
            v-for="logo in logos"
            :key="`${set}-${logo.alt}`"
            :src="logo.src"
            :alt="logo.alt"
            :class="[logo.h, 'w-auto shrink-0 object-contain mx-[30px] md:mx-[51px]']"
          >
        </template>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         THE METHODOLOGY
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-[#F4ED18]">
      <div class="max-w-[1192px] mx-auto px-6 md:px-8">
        <h2
          class="text-[#1D96B8] text-[36px] md:text-[48px] leading-[58px] font-medium tracking-[-0.48px] mb-10 md:mb-[42px]"
          style="font-family: 'Fredoka', sans-serif;"
        >
          The Methodology
        </h2>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div
            v-for="step in steps"
            :key="step.number"
            class="bg-[#1D96B8] rounded-[8px] p-6 flex flex-col"
            style="border: 1px solid rgba(255, 255, 255, 0.05); backdrop-filter: blur(2px); min-height: 218px;"
          >
            <!-- Number -->
            <p
              class="text-[#F4ED18] text-[48px] md:text-[64px] leading-[64px] font-bold"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              {{ step.number }}
            </p>
            <!-- Title -->
            <h3
              class="text-white text-[20px] md:text-[24px] leading-[36px] font-semibold mt-[8.7px]"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              {{ step.title }}
            </h3>
            <!-- Description -->
            <p
              class="text-white text-[14px] md:text-[16px] leading-[26px] font-normal mt-auto"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              {{ step.description }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         BUILD YOUR BRAND CTA
         ═══════════════════════════════════════════ -->
    <section class="py-16 md:py-20 bg-white text-center">
      <div class="max-w-[524px] mx-auto px-6">
        <h2
          class="text-[#1D96B8] text-[40px] md:text-[64px] leading-[1.2] font-medium mb-0"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Build Your Brand
        </h2>
        <p
          class="text-black text-[16px] md:text-[18px] leading-[28px] font-normal mb-[30px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Let's Build Something Powerful.
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center justify-center gap-[5px] px-6 md:px-8 py-2.5 bg-[#F4ED18] text-[#201F1F] text-[16px] md:text-[20px] font-bold rounded-full hover:brightness-95 transition-all"
          style="font-family: 'Bricolage Grotesque', sans-serif; box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);"
        >
          <span>Start Your Project</span>
          <svg class="w-[20px] h-[19px] md:w-[25px] md:h-[23px]" viewBox="0 0 12 12" fill="none">
            <path d="M0.0349998 9.348L1.305 10.74L7.879 4.679C7.243 6.979 7.854 9.432 9.285 11.506L10.744 10.175C8.797 7.436 8.738 3.803 11.303 1.462L10.186 0.238C7.621 2.579 4.009 2.189 1.458 0L0 1.331C1.934 2.945 4.322 3.777 6.67 3.355L0.0349998 9.348Z" fill="#141111" />
          </svg>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-33.333%);
  }
}

.animate-marquee {
  animation: marquee 25s linear infinite;
  width: max-content;
}

.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
