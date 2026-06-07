<script setup lang="ts">
const { caseStudies } = useCaseStudies()

const route = useRoute()
const slug = route.params.slug as string
const study = computed(() => caseStudies.value.find(s => s.slug === slug))

if (!study.value) {
  throw createError({ statusCode: 404, statusMessage: 'Case study not found', fatal: true })
}

useSeoMeta({
  title: () => study.value ? `${study.value.title} — Macawoo Case Study` : 'Macawoo Case Study',
  description: () => study.value ? study.value.challenge.slice(0, 160) : ''
})
</script>

<template>
  <div v-if="study">
    <!-- Back -->
    <div class="pt-20 pb-4 px-6 max-w-7xl mx-auto">
      <NuxtLink
        to="/case-studies"
        class="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-brand-teal-500 transition-colors"
      >
        ← Back
      </NuxtLink>
    </div>

    <!-- Hero image -->
    <div class="w-full aspect-[16/7] overflow-hidden">
      <img
        :src="study.heroImage"
        :alt="study.title"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Tags + title -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in study.tags"
            :key="tag"
            class="text-xs font-medium px-3 py-1.5 rounded-full bg-brand-dark text-white"
          >
            {{ tag }}
          </span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-brand-dark">
          {{ study.title }}
        </h1>
      </div>
    </section>

    <!-- Challenge -->
    <section class="py-14 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-brand-teal-500 mb-5">
          The Challenge
        </h2>
        <p class="text-zinc-700 text-base leading-relaxed max-w-3xl">
          {{ study.challenge }}
        </p>
      </div>
    </section>

    <!-- Approach -->
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-brand-teal-500 mb-5">
          Our Approach
        </h2>
        <p class="text-zinc-700 text-base leading-relaxed max-w-3xl">
          {{ study.approach }}
        </p>
      </div>
    </section>

    <!-- Solution -->
    <section class="py-14 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-brand-teal-500 mb-5">
          The Solution
        </h2>
        <ul class="space-y-3 max-w-2xl">
          <li
            v-for="item in study.solution"
            :key="item"
            class="flex gap-3 items-start"
          >
            <span class="mt-1 w-5 h-5 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center">
              <svg
                class="w-3 h-3 text-brand-dark"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="3"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </span>
            <span class="text-zinc-700 text-sm leading-relaxed">{{ item }}</span>
          </li>
        </ul>
      </div>
    </section>

    <!-- Results -->
    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-brand-dark mb-10">
          The Results
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div
            v-for="result in study.results"
            :key="result.label"
            class="text-center"
          >
            <div class="text-4xl font-bold text-brand-teal-500 mb-2">
              {{ result.metric }}
            </div>
            <p class="text-zinc-600 text-sm">
              {{ result.label }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-brand-yellow-500 text-center">
      <div class="max-w-xl mx-auto px-6">
        <h2 class="text-3xl font-bold text-brand-dark mb-8">
          Want Results Like This?
        </h2>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-brand-dark text-white font-bold rounded-full text-sm hover:bg-brand-dark/80 transition-colors"
        >
          Start Your Project →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
