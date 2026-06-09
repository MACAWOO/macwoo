<script setup lang="ts">
const { projects } = usePortfolio()

useSeoMeta({
  title: 'Portfolio — Macawoo',
  description: 'Work that speaks. Results that matter. A curated showcase of our finest projects.'
})

const activeFilter = ref<'All' | 'Branding' | 'Marketing' | 'Video Production'>('All')
const filters = ['All', 'Branding', 'Marketing', 'Video Production'] as const

const filtered = computed(() => {
  if (activeFilter.value === 'All') return projects.value
  return projects.value.filter((p) => {
    if (activeFilter.value === 'Branding') return p.category === 'Branding'
    if (activeFilter.value === 'Marketing') return p.category === 'Marketing'
    if (activeFilter.value === 'Video Production') return p.category === 'Video Production'
    return true
  })
})

const pairs = computed(() => {
  const result = []
  for (let i = 0; i < filtered.value.length; i += 2) {
    result.push(filtered.value.slice(i, i + 2))
  }
  return result
})
</script>

<template>
  <div>
    <PageHero
      title-html="Work That Speaks.<br><em class='not-italic text-brand-yellow-500'>Results That Matter.</em>"
      video="/Background%20Videos/Portfolio.mp4"
      image="/Images/Marketing.jpeg"
      description="A curated selection of our finest projects, demonstrating our commitment to visionary design and strategic execution."
      show-grid
      min-height="min-h-[386px]"
    />

    <div class="bg-[#1D96B8]">
      <!-- Filters -->
      <div class="max-w-[1200px] mx-auto px-6 pt-16 pb-10 flex flex-wrap gap-3 justify-center">
        <button
          v-for="filter in filters"
          :key="filter"
          class="px-5 py-2 rounded-full text-base font-medium transition-colors"
          :class="activeFilter === filter
            ? 'bg-brand-yellow-500 text-brand-dark'
            : 'border border-brand-yellow-500 text-brand-yellow-500 hover:bg-brand-yellow-500/10'"
          @click="activeFilter = filter"
        >
          {{ filter }}
        </button>
      </div>

      <!-- Portfolio grid -->
      <div class="max-w-[1200px] mx-auto px-6 pb-16">
        <div
          v-if="filtered.length"
          class="flex flex-col gap-10"
        >
          <div
            v-for="(pair, pairIndex) in pairs"
            :key="pairIndex"
            class="flex flex-col md:flex-row gap-10 items-start"
          >
            <template v-if="pairIndex % 2 === 0">
              <PortfolioCard
                v-if="pair[0]"
                :project="pair[0]"
                size="large"
              />
              <PortfolioCard
                v-if="pair[1]"
                :project="pair[1]"
                size="small"
              />
            </template>
            <template v-else>
              <PortfolioCard
                v-if="pair[0]"
                :project="pair[0]"
                size="small"
              />
              <PortfolioCard
                v-if="pair[1]"
                :project="pair[1]"
                size="large"
              />
            </template>
          </div>
        </div>
        <div
          v-else
          class="py-20 text-center text-white/60"
        >
          No projects in this category yet.
        </div>
      </div>

      <!-- Pagination -->
      <div class="max-w-[1200px] mx-auto px-6 pb-16 flex justify-end">
        <div class="flex items-center gap-3">
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg
              class="w-[41px] h-[41px] rotate-180"
              viewBox="0 0 76 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="38"
                cy="38"
                r="34"
                fill="white"
              />
              <path
                d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z"
                fill="#141111"
              />
            </svg>
          </button>
          <span class="font-medium text-white text-lg">Page: 01</span>
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center hover:opacity-80 transition-opacity">
            <svg
              class="w-[41px] h-[41px]"
              viewBox="0 0 76 76"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="38"
                cy="38"
                r="34"
                fill="white"
              />
              <path
                d="M23.7001 36.4138L23.6507 40.3664L42.405 40.4601C38.1352 43.0818 35.5561 47.7211 34.7762 52.9509L38.9181 52.9934C39.8606 46.005 44.9759 40.3433 52.2592 40.4165L52.3021 36.9405C45.0189 36.8673 40.0452 31.1047 39.2744 24.0972L35.134 24.0561C35.7836 29.2988 38.2492 33.9901 42.4503 36.6991L23.7001 36.4138Z"
                fill="#141111"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
