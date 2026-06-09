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
}

withDefaults(defineProps<Props>(), {
  minHeight: 'min-h-screen',
  align: 'center',
  showGrid: false
})
</script>

<template>
  <section
    class="relative w-full flex items-center overflow-hidden bg-brand-dark"
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
      :poster="image"
      class="absolute inset-0 w-full h-full object-cover"
    >
      <source
        :src="video"
        type="video/mp4"
      >
    </video>

    <!-- Single Backdrop Blur Overlay for high-performance scrolling -->
    <div
      v-if="showGrid"
      class="absolute inset-0 pointer-events-none z-[4]"
      style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
      aria-hidden="true"
    />

    <!-- Premium Glass Panel Overlay -->
    <div
      v-if="showGrid"
      class="absolute inset-0 pointer-events-none z-[5] flex items-center justify-start overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      <div
        v-for="i in 53"
        :key="i"
        class="glass-panel"
        :style="{ '--panel-index': i }"
      >
        <svg
          class="glass-svg"
          width="29"
          height="386"
          viewBox="0 0 29 386"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect
            y="-96"
            width="29"
            height="519"
            fill="#1E1E1E"
            fill-opacity="0.2"
          />
        </svg>
      </div>
    </div>

    <!-- Static image background -->
    <img
      v-else-if="image"
      :src="image"
      alt=""
      class="absolute inset-0 w-full h-full object-cover opacity-30"
    >

    <!-- Left Arrow -->
    <NuxtLink
      v-if="showArrows && prevTo"
      :to="prevTo"
      class="absolute left-4 md:left-[120px] top-1/2 -translate-y-1/2 z-20 w-[48px] h-[48px] md:w-[68px] md:h-[68px] flex items-center justify-center hover:scale-105 transition-transform"
    >
      <svg
        class="w-full h-full -scale-x-100"
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filterLeftArrowPH)">
          <circle
            cx="38"
            cy="38"
            r="34"
            fill="white"
          />
        </g>
        <path
          d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z"
          fill="#141111"
        />
        <defs>
          <filter
            id="filterLeftArrowPH"
            x="0"
            y="0"
            width="76"
            height="76"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood
              flood-opacity="0"
              result="BackgroundImageFix"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite
              in2="hardAlpha"
              operator="out"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_165_405"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_165_405"
              result="shape"
            />
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
      <svg
        class="w-full h-full"
        viewBox="0 0 76 76"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g filter="url(#filterRightArrowPH)">
          <circle
            cx="38"
            cy="38"
            r="34"
            fill="white"
          />
        </g>
        <path
          d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z"
          fill="#141111"
        />
        <defs>
          <filter
            id="filterRightArrowPH"
            x="0"
            y="0"
            width="76"
            height="76"
            filterUnits="userSpaceOnUse"
            color-interpolation-filters="sRGB"
          >
            <feFlood
              flood-opacity="0"
              result="BackgroundImageFix"
            />
            <feColorMatrix
              in="SourceAlpha"
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
              result="hardAlpha"
            />
            <feOffset />
            <feGaussianBlur stdDeviation="2" />
            <feComposite
              in2="hardAlpha"
              operator="out"
            />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
            />
            <feBlend
              mode="normal"
              in2="BackgroundImageFix"
              result="effect1_dropShadow_165_405"
            />
            <feBlend
              mode="normal"
              in="SourceGraphic"
              in2="effect1_dropShadow_165_405"
              result="shape"
            />
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
/* ── Premium Glassmorphism Vertical Panels ── */
.glass-panel {
  position: relative;
  display: block !important;
  width: calc(100% / 53) !important;
  flex: 0 0 calc(100% / 53) !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
  overflow: hidden;
  pointer-events: none; /* Let all mouse events pass through to content */
}

/* Sub-pixel SVG styling to fit perfectly inside the column wrapper */
.glass-svg {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
  z-index: 1;
  pointer-events: none;
}

/* Alternating gradients to create realistic refractive depth between side-by-side sheets */
.glass-panel:nth-child(odd) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.02) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.18), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.4);         /* Shadow cast to the right */
}

.glass-panel:nth-child(even) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.01) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.14), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.35);        /* Shadow cast to the right */
}

/* Left edge reflection — sharp vertical specular highlight */
.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.30) 25%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.30) 75%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  z-index: 2;
}

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
