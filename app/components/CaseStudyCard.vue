<script setup lang="ts">
import type { CaseStudy } from '~/data/case-studies'

interface Props {
  study: CaseStudy
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="`/case-studies/${study.slug}`"
    class="group block bg-white rounded-[34px] overflow-hidden shadow-[0px_0px_2px_rgba(0,0,0,0.25)] hover:shadow-lg transition-shadow"
  >
    <!-- Image -->
    <div class="h-[280px] md:h-[380px] overflow-hidden">
      <NuxtImg
        :src="study.image"
        :alt="study.title"
        loading="lazy"
        format="webp"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>

    <!-- Card bottom -->
    <div class="px-7 py-6 flex flex-col gap-3">
      <!-- Pills -->
      <div class="flex flex-wrap gap-3">
        <span
          v-for="tag in study.tags.slice(0, 2)"
          :key="tag"
          class="border border-brand-dark text-brand-dark text-sm font-normal leading-[28px] px-3 py-1.5 rounded-full inline-flex items-center gap-1.5"
        >
          <svg
            v-if="study.tags.indexOf(tag) === 0"
            class="w-4 h-4 shrink-0"
            viewBox="0 0 17 17"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.5 8.5L6 12L14.5 3.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21h18M6 21V7l6-4 6 4v14M9 21v-5h6v5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ tag }}
        </span>
      </div>

      <!-- Title + subtitle -->
      <div class="flex flex-col gap-0.5">
        <h3 class="font-medium text-brand-dark text-2xl md:text-[32px] leading-tight">
          {{ study.title }}
        </h3>
        <p
          v-if="study.tagline"
          class="text-brand-dark text-sm md:text-base font-normal leading-snug"
        >
          {{ study.tagline }}
        </p>
      </div>
    </div>
  </NuxtLink>
</template>
