<script setup lang="ts">
import type { PortfolioProject } from '~/data/portfolio'

interface Props {
  project: PortfolioProject
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="`/portfolio/${project.slug}`"
    class="group block bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
  >
    <div class="aspect-[4/3] overflow-hidden">
      <img
        :src="project.image"
        :alt="project.title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      >
    </div>
    <div class="p-5">
      <h3 class="font-bold text-brand-dark text-lg mb-2">{{ project.title }}</h3>
      <div class="flex flex-wrap gap-2">
        <span
          v-for="tag in project.tags.slice(0, 2)"
          :key="tag"
          class="text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-600"
        >
          {{ tag }}
        </span>
      </div>
    </div>
  </NuxtLink>
</template>
