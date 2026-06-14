<script setup lang="ts">
import type { PortfolioProject } from '~/data/portfolio'

interface Props {
  project: PortfolioProject
  size?: 'large' | 'small'
}

withDefaults(defineProps<Props>(), {
  size: 'large'
})
</script>

<template>
  <NuxtLink
    :to="`/portfolio/${project.slug}`"
    class="group flex flex-col gap-5 w-full"
    :class="size === 'large' ? 'md:flex-[1.44]' : 'md:flex-1'"
  >
    <div class="overflow-hidden rounded-[34px] shadow-[0px_0px_4px_0px_rgba(0,0,0,0.25)]">
      <NuxtImg
        :src="project.image"
        :alt="project.title"
        loading="lazy"
        format="webp"
        class="w-full h-[380px] md:h-[550px] object-cover group-hover:scale-105 transition-transform duration-500"
      />
    </div>
    <div class="flex flex-col gap-2">
      <h3 class="font-medium text-white text-2xl md:text-[32px] leading-tight">
        {{ project.title }}
      </h3>
      <span class="self-start border border-white text-white text-base md:text-[20px] font-normal leading-[28px] px-3 py-2 rounded-[56px]">
        {{ project.subtitle }}
      </span>
    </div>
  </NuxtLink>
</template>
