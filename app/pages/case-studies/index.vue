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
      description="Detailed case studies demonstrating our commitment to performance design and delivering results for ambitious founders and growing businesses."
    />

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 gap-6">
          <CaseStudyCard
            v-for="study in caseStudies"
            :key="study.slug"
            :study="study"
          />
        </div>
      </div>
    </section>
  </div>
</template>
