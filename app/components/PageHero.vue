<script setup lang="ts">
interface Cta {
  label: string
  to: string
  variant?: 'primary' | 'outline' | 'white'
}

interface Props {
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
  showGrid?: boolean
  imageClass?: string
  contentStyle?: Record<string, string | number | undefined>
  imageStyle?: Record<string, string | number | undefined>
}

withDefaults(defineProps<Props>(), {
  minHeight: 'min-h-screen',
  align: 'center',
  showGrid: false,
  imageClass: '',
  contentStyle: () => ({})
})

const videoLoaded = ref(false)
const handleVideoPlayable = () => {
  videoLoaded.value = true
}
</script>

<template>
  <section
    class="relative w-full flex items-center overflow-hidden bg-[#141111]"
    :class="[
      minHeight
    ]"
  >
    <!-- Video background -->
    <video
      v-if="video"
      autoplay
      muted
      loop
      playsinline
      preload="auto"
      :poster="image"
      class="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
      :class="[videoLoaded ? 'opacity-100' : 'opacity-0']"
      :style="imageStyle"
      @loadeddata="handleVideoPlayable"
    >
      <source
        :src="video"
        type="video/mp4"
      >
    </video>

    <!-- Premium Glass Panel Overlay -->
    <GlassGrid v-if="showGrid" />

    <!-- Static image background -->
    <NuxtImg
      v-else-if="image"
      :src="image"
      alt=""
      class="absolute inset-0 w-full h-full object-cover opacity-30"
      :class="imageClass"
      :style="imageStyle"
      preload
      format="webp"
    />

    <!-- Left Arrow -->
    <NuxtLink
      v-if="showArrows && prevTo"
      :to="prevTo"
      class="absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
    >
      <LeftArrow class="w-[38%] h-[38%]" />
    </NuxtLink>

    <!-- Right Arrow -->
    <NuxtLink
      v-if="showArrows && nextTo"
      :to="nextTo"
      class="absolute right-4 md:right-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.25)] hover:scale-105 transition-transform"
    >
      <RightArrow class="w-[38%] h-[38%]" />
    </NuxtLink>

    <!-- Content -->
    <div
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col"
      :class="[
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      ]"
      :style="contentStyle"
    >
      <!-- Eyebrow -->
      <p
        v-if="eyebrow"
        class="text-brand-yellow-500 text-xs font-semibold tracking-widest uppercase mb-4"
      >
        {{ eyebrow }}
      </p>

      <!-- Title -->
      <!-- eslint-disable-next-line vue/no-v-html -->
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
          :class="[
            cta.variant === 'outline' && 'border border-white text-white hover:bg-white/10',
            cta.variant === 'white' && 'bg-white text-brand-dark hover:bg-zinc-100',
            (!cta.variant || cta.variant === 'primary') && 'bg-brand-yellow-500 text-brand-dark hover:bg-brand-yellow-400'
          ]"
        >
          {{ cta.label }}
        </NuxtLink>
      </div>
    </div>

    <!-- SVG Displacement Filters for Flat Glass Rectangle Refraction -->
    <svg
      class="absolute w-0 h-0 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <!--
          Left displacement filter: shifts the background flatly to the left
          inside the column, returning to 0 at the beveled outer edges.
        -->
        <filter
          id="glass-dispersion-left"
          x="-20%"
          y="-10%"
          width="140%"
          height="120%"
          filterUnits="objectBoundingBox"
        >
          <feImage
            href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='8%25' stop-color='%23588080'/%3E%3Cstop offset='92%25' stop-color='%23588080'/%3E%3Cstop offset='100%25' stop-color='%23808080'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
            result="dispMap"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="dispMap"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feOffset
            dx="-5.5"
            dy="-3.5"
            in="displaced"
            result="red"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            in="red"
            result="red-only"
          />

          <feOffset
            dx="5.5"
            dy="3.5"
            in="displaced"
            result="blue"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            in="blue"
            result="blue-only"
          />

          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            in="displaced"
            result="green-only"
          />

          <feBlend
            mode="screen"
            in="red-only"
            in2="green-only"
            result="rg"
          />
          <feBlend
            mode="screen"
            in="rg"
            in2="blue-only"
          />
        </filter>

        <filter
          id="glass-dispersion-right"
          x="-20%"
          y="-10%"
          width="140%"
          height="120%"
          filterUnits="objectBoundingBox"
        >
          <feImage
            href="data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='0'%3E%3Cstop offset='0%25' stop-color='%23808080'/%3E%3Cstop offset='8%25' stop-color='%23a88080'/%3E%3Cstop offset='92%25' stop-color='%23a88080'/%3E%3Cstop offset='100%25' stop-color='%23808080'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100' height='100' fill='url(%23g)'/%3E%3C/svg%3E"
            result="dispMap"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="dispMap"
            scale="20"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
          <feOffset
            dx="-5.5"
            dy="-3.5"
            in="displaced"
            result="red"
          />
          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0"
            in="red"
            result="red-only"
          />

          <feOffset
            dx="5.5"
            dy="3.5"
            in="displaced"
            result="blue"
          />
          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            in="blue"
            result="blue-only"
          />

          <feColorMatrix
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            in="displaced"
            result="green-only"
          />

          <feBlend
            mode="screen"
            in="red-only"
            in2="green-only"
            result="rg"
          />
          <feBlend
            mode="screen"
            in="rg"
            in2="blue-only"
          />
        </filter>
      </defs>
    </svg>
  </section>
</template>

<style scoped>
/* Custom 1442x386 Desktop Aspect Ratio overrides */
@media (min-width: 1024px) {
  .custom-hero-ratio {
    width: 100% !important;
    max-width: none !important;
    height: 386px !important;
    min-height: 386px !important;
  }

  .custom-hero-ratio .py-24,
  .custom-hero-ratio :deep(.py-24) {
    padding-top: 2.25rem !important;
    padding-bottom: 2.25rem !important;
  }

  .custom-hero-ratio h1,
  .custom-hero-ratio :deep(h1) {
    font-size: 2.75rem !important;
    line-height: 3.25rem !important;
    margin-bottom: 0.5rem !important;
  }

  .custom-hero-ratio p,
  .custom-hero-ratio :deep(p) {
    font-size: 0.95rem !important;
    line-height: 1.4rem !important;
    margin-bottom: 1.25rem !important;
    max-width: 650px !important;
  }
}

@media (max-width: 1023px) {
  .custom-hero-ratio {
    width: 100% !important;
    min-height: 360px !important;
  }

  .custom-hero-ratio .py-24,
  .custom-hero-ratio :deep(.py-24) {
    padding-top: 3.5rem !important;
    padding-bottom: 3.5rem !important;
  }

  .custom-hero-ratio h1,
  .custom-hero-ratio :deep(h1) {
    font-size: 2.25rem !important;
    line-height: 2.75rem !important;
    margin-bottom: 0.5rem !important;
  }

  .custom-hero-ratio p,
  .custom-hero-ratio :deep(p) {
    font-size: 0.9rem !important;
    line-height: 1.35rem !important;
    margin-bottom: 1.25rem !important;
  }
}
</style>
