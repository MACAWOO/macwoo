<script setup lang="ts">
interface Cta {
  label: string
  to: string
  variant?: 'primary' | 'outline'
}

interface Props {
  variant?: 'dark' | 'teal'
  video?: string
  image?: string
  eyebrow?: string
  titleHtml: string
  description?: string
  ctas?: Cta[]
  showArrows?: boolean
  prevTo?: string
  nextTo?: string
  minHeight?: string
  align?: 'left' | 'center'
}

withDefaults(defineProps<Props>(), {
  variant: 'dark',
  minHeight: 'min-h-screen',
  align: 'center'
})
</script>

<template>
  <section
    class="relative w-full flex items-center overflow-hidden"
    :class="[
      minHeight,
      variant === 'dark' ? 'bg-brand-dark' : 'bg-brand-teal-500'
    ]"
  >
    <!-- Video background -->
    <video
      v-if="video"
      autoplay
      muted
      loop
      playsinline
      :poster="image"
      class="absolute inset-0 w-full h-full object-cover opacity-40"
    >
      <source
        :src="video"
        type="video/mp4"
      >
    </video>

    <!-- Static image background -->
    <img
      v-else-if="image"
      :src="image"
      alt=""
      class="absolute inset-0 w-full h-full object-cover opacity-30"
    >

    <!-- Gradient overlay -->
    <div class="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />

    <!-- Top Gradient Vignette (Rectangle 4) -->
    <div class="absolute top-0 left-0 right-0 h-[196px] bg-gradient-to-b from-black/80 to-transparent pointer-events-none z-10" />

    <!-- Left Arrow -->
    <NuxtLink
      v-if="showArrows && prevTo"
      :to="prevTo"
      class="absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg class="w-full h-full -scale-x-100" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filterLeftArrowPH)">
          <circle cx="38" cy="38" r="34" fill="white"/>
        </g>
        <path d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z" fill="#141111"/>
        <defs>
          <filter id="filterLeftArrowPH" x="0" y="0" width="76" height="76" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_165_405"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_165_405" result="shape"/>
          </filter>
        </defs>
      </svg>
    </NuxtLink>

    <!-- Right Arrow -->
    <NuxtLink
      v-if="showArrows && nextTo"
      :to="nextTo"
      class="absolute right-4 md:right-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg class="w-full h-full" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filterRightArrowPH)">
          <circle cx="38" cy="38" r="34" fill="white"/>
        </g>
        <path d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z" fill="#141111"/>
        <defs>
          <filter id="filterRightArrowPH" x="0" y="0" width="76" height="76" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
            <feFlood flood-opacity="0" result="BackgroundImageFix"/>
            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
            <feOffset/>
            <feGaussianBlur stdDeviation="2"/>
            <feComposite in2="hardAlpha" operator="out"/>
            <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"/>
            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_165_405"/>
            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_165_405" result="shape"/>
          </filter>
        </defs>
      </svg>
    </NuxtLink>

    <!-- Content -->
    <div
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col"
      :class="[
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      ]"
    >
      <!-- Eyebrow -->
      <p
        v-if="eyebrow"
        class="text-brand-yellow-500 text-xs font-semibold tracking-widest uppercase mb-4"
      >
        {{ eyebrow }}
      </p>

      <!-- Title -->
      <h1
        class="font-fredoka text-5xl md:text-7xl lg:text-[96px] font-medium text-white leading-tight lg:leading-[116px] mb-2 lg:max-w-[699px] text-center"
        v-html="titleHtml"
      />

      <!-- Description -->
      <p
        v-if="description"
        class="text-white text-base md:text-lg lg:text-[20px] font-normal leading-relaxed lg:leading-[28px] lg:max-w-[728px] text-center mb-8"
      >
        {{ description }}
      </p>

      <!-- CTAs -->
      <div
        v-if="ctas?.length"
        class="flex flex-wrap gap-4"
      >
        <NuxtLink
          v-for="cta in ctas"
          :key="cta.to"
          :to="cta.to"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold transition-colors"
          :class="cta.variant === 'outline'
            ? 'border border-white text-white hover:bg-white/10'
            : 'bg-brand-yellow-500 text-brand-dark hover:bg-brand-yellow-400'"
        >
          {{ cta.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
