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
    class="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
  >
    <div class="aspect-[4/3] overflow-hidden relative">
      <img
        :src="study.image"
        :alt="study.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      >
    </div>
    <div class="p-5">
      <div class="flex flex-wrap gap-2 mb-3">
        <span
          v-for="tag in study.tags"
          :key="tag"
          class="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-600"
        >
          {{ tag }}
        </span>
      </div>
      <h3 class="font-bold text-brand-dark text-lg leading-snug">{{ study.title }}</h3>
    </div>
  </NuxtLink>
</template>
