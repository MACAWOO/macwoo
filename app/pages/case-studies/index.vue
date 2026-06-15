<script setup lang="ts">
const { caseStudies, fetchPromise: caseStudiesPromise } = useCaseStudies()
if (caseStudiesPromise) {
  await caseStudiesPromise
}

const { categories, fetchPromise: categoriesPromise } = useCategories()
if (categoriesPromise) {
  await categoriesPromise
}

useSeoMeta({
  title: 'Macawoo Case Studies — Brand Transformation Results',
  description: 'Not just work. Proven impact. Detailed case studies demonstrating our results-driven approach for ambitious founders.',
  ogTitle: 'Macawoo Case Studies — Brand Transformation Results',
  ogDescription: 'Not just work. Proven impact. Detailed case studies demonstrating our results-driven approach for ambitious founders.'
})

const siteUrl = 'https://www.macawoo.in'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'CollectionPage',
            '@id': `${siteUrl}/case-studies#webpage`,
            'url': `${siteUrl}/case-studies`,
            'name': 'Macawoo Case Studies — Brand Transformation Results',
            'description': 'Not just work. Proven impact. Detailed case studies demonstrating our results-driven approach for ambitious founders.',
            'isPartOf': { '@id': `${siteUrl}/#website` }
          },
          {
            '@type': 'BreadcrumbList',
            '@id': `${siteUrl}/case-studies#breadcrumb`,
            'itemListElement': [
              {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': siteUrl
              },
              {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Case Studies',
                'item': `${siteUrl}/case-studies`
              }
            ]
          }
        ]
      })
    }
  ]
})

const activeFilter = ref<string>('All')
const filters = computed(() => ['All', ...categories.value])

const filtered = computed(() => {
  if (activeFilter.value === 'All') return caseStudies.value
  return caseStudies.value.filter(study => study.category === activeFilter.value)
})
</script>

<template>
  <div>
    <PageHero
      title-html="Not Just Work.<br><em class='not-italic text-brand-yellow-500'>Proven Impact.</em>"
      video="/Background_Videos/Case_Study.mp4"
      image="/Images/Marketing.jpeg"
      description="Dive deep into how we transform bold visions into measurable realities for ambitious founders and marketing directors."
      class="custom-hero-ratio"
      show-grid
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

      <!-- Cards grid -->
      <div class="max-w-[1200px] mx-auto px-6 pb-10">
        <div
          v-if="filtered.length"
          class="grid md:grid-cols-2 gap-6"
        >
          <CaseStudyCard
            v-for="study in filtered"
            :key="study.slug"
            :study="study"
          />
        </div>
        <div
          v-else
          class="py-20 text-center text-white/60"
        >
          No case studies in this category yet.
        </div>
      </div>

      <!-- Pagination -->
      <div class="max-w-[1200px] mx-auto px-6 pb-16 flex justify-end">
        <div class="flex items-center gap-3">
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-80 transition-opacity">
            <LeftArrow class="w-[45%] h-[45%]" />
          </button>
          <span class="font-medium text-white text-lg">Page: 01</span>
          <button class="w-[41px] h-[41px] rounded-full flex items-center justify-center bg-white shadow-[0_2px_8px_rgba(0,0,0,0.12)] hover:opacity-80 transition-opacity">
            <RightArrow class="w-[45%] h-[45%]" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
