<script setup lang="ts">
import type { ResolvedFeaturedProject } from '~/types/featured-project'

interface Props {
  project: ResolvedFeaturedProject
  isLarge?: boolean
}

defineProps<Props>()
</script>

<template>
  <NuxtLink
    :to="`/portfolio/${project.slug}`"
    class="group block"
  >
    <!-- Image container — matching reference size ratios -->
    <div
      class="overflow-hidden rounded-[16px] w-full"
      :class="isLarge ? 'aspect-[680/662]' : 'aspect-[470/550]'"
    >
      <NuxtImg
        :src="project.image_url"
        :alt="project.title"
        loading="lazy"
        format="webp"
        class="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
      />
    </div>

    <!-- Title + category pill -->
    <div class="mt-3">
      <h3
        class="text-white text-[20px] md:text-[22px] font-medium leading-tight mb-2 transition-colors duration-300 ease-out group-hover:text-[#F7EC12]"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >
        {{ project.title }}
      </h3>
      <span
        class="inline-block px-4 py-1.5 rounded-full text-white text-[13px] md:text-[14px] font-normal leading-none select-none border-[1.2px] border-white/45 transition-all duration-300 ease-out delay-75 group-hover:bg-[#F7EC12] group-hover:text-[#0596B8] group-hover:border-[#F7EC12]"
        style="font-family: 'Bricolage Grotesque', sans-serif;"
      >
        {{ project.category }}
      </span>
    </div>
  </NuxtLink>
</template>
