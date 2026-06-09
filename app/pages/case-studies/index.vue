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
      show-grid
      min-height="min-h-[386px]"
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
