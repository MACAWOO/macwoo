<script setup lang="ts">
const { caseStudies } = useCaseStudies()

useSeoMeta({
  title: 'Case Studies — Macawoo',
  description: 'Not just work. Proven impact. Detailed case studies demonstrating our results-driven approach for ambitious founders.'
})
</script>

<template>
  <div>
    <PageHero
      title-html="Not Just Work.<br><em class='not-italic text-brand-yellow-500'>Proven Impact.</em>"
      video="/Background%20Videos/Case%20Study.mp4"
      image="/Images/Marketing.jpeg"
      description="Dive deep into how we transform bold visions into measurable realities for ambitious founders and marketing directors."
      class="custom-hero-ratio"
      show-grid
    />

    <div class="bg-[#1D96B8]">
      <!-- Cards grid -->
      <div class="max-w-[1200px] mx-auto px-6 pt-16 pb-10">
        <div class="grid md:grid-cols-2 gap-6">
          <CaseStudyCard
            v-for="study in caseStudies"
            :key="study.slug"
            :study="study"
          />
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
