<script setup lang="ts">
import { projects } from '~/data/portfolio'

useSeoMeta({
  title: 'Portfolio — Macawoo',
  description: 'Work that speaks. Results that matter. A curated showcase of our finest projects.'
})

const activeFilter = ref<'All' | 'Branding' | 'Marketing' | 'Video Production'>('All')

const filters = ['All', 'Branding', 'Marketing', 'Video Production'] as const

const filtered = computed(() => {
  if (activeFilter.value === 'All') return projects
  return projects.filter((p) => {
    if (activeFilter.value === 'Branding') return p.category === 'Branding'
    if (activeFilter.value === 'Marketing') return p.category === 'Marketing'
    if (activeFilter.value === 'Video Production') return p.category === 'Video Production'
    return true
  })
})
</script>

<template>
  <div>
    <PageHero
      title-html="Work That Speaks.<br><em class='not-italic text-brand-yellow-500'>Results That Matter.</em>"
      video="/Background%20Videos/Portfolio.mp4"
      image="/Images/Marketing.jpeg"
      description="A curated showcase of our finest projects, demonstrating our commitment to visionary design and strategic execution."
    />

    <!-- Filter tabs -->
    <section class="py-12 bg-white border-b border-zinc-100">
      <div class="max-w-7xl mx-auto px-6 flex flex-wrap gap-3">
        <button
          v-for="filter in filters"
          :key="filter"
          class="px-5 py-2 rounded-full text-sm font-semibold transition-colors"
          :class="activeFilter === filter
            ? 'bg-brand-yellow-500 text-brand-dark'
            : 'border border-zinc-300 text-zinc-600 hover:border-brand-yellow-500 hover:text-brand-dark'"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>
    </section>

    <!-- Grid -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div
          v-if="filtered.length"
          class="grid md:grid-cols-2 gap-6"
        >
          <PortfolioCard
            v-for="project in filtered"
            :key="project.slug"
            :project="project"
          />
        </div>
        <div
          v-else
          class="py-20 text-center text-zinc-400"
        >
          No projects in this category yet.
        </div>
      </div>
    </section>
  </div>
</template>
