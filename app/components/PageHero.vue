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

    <!-- Content -->
    <div
      class="relative z-20 w-full max-w-7xl mx-auto px-6 py-24 flex flex-col"
      :class="[
        align === 'center' ? 'items-center text-center' : 'items-start text-left'
      ]"
    >
      <!-- Arrow navigation -->
      <div
        v-if="showArrows"
        class="flex items-center gap-4 mb-8"
      >
        <NuxtLink
          v-if="prevTo"
          :to="prevTo"
          class="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          ←
        </NuxtLink>
        <NuxtLink
          v-if="nextTo"
          :to="nextTo"
          class="w-10 h-10 rounded-full border border-white/40 flex items-center justify-center text-white hover:bg-white/10 transition-colors"
        >
          →
        </NuxtLink>
      </div>

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
