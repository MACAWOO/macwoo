<script setup lang="ts">
import { projects } from '~/data/portfolio'

const route = useRoute()
const slug = route.params.slug as string
const project = projects.find(p => p.slug === slug)

if (!project) {
  throw createError({ statusCode: 404, message: 'Project not found' })
}

useSeoMeta({
  title: `${project.title} — Macawoo Portfolio`,
  description: project.subtitle
})

const galleryIndex = ref(0)
</script>

<template>
  <div v-if="project">
    <!-- Back -->
    <div class="pt-20 pb-4 px-6 max-w-7xl mx-auto">
      <NuxtLink
        to="/portfolio"
        class="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-brand-teal-500 transition-colors"
      >
        ← Back
      </NuxtLink>
    </div>

    <!-- Hero image -->
    <div class="w-full aspect-[16/7] overflow-hidden">
      <img
        :src="project.heroImage"
        :alt="project.title"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Tags + title -->
    <section class="py-12 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-wrap gap-2 mb-6">
          <span
            v-for="tag in project.tags"
            :key="tag"
            class="text-xs font-medium px-3 py-1.5 rounded-full bg-brand-dark text-white"
          >
            {{ tag }}
          </span>
        </div>
        <h1 class="text-4xl md:text-6xl font-bold text-brand-dark mb-4">
          {{ project.title }}
        </h1>
        <p class="text-zinc-600 text-lg max-w-2xl">
          {{ project.subtitle }}
        </p>
      </div>
    </section>

    <!-- Story -->
    <section class="py-16 bg-white border-t border-zinc-100">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-brand-teal-500 mb-6">
          The Story Behind the Project
        </h2>
        <p class="text-zinc-700 text-base leading-relaxed max-w-3xl">
          {{ project.story }}
        </p>
      </div>
    </section>

    <!-- Design Highlights -->
    <section
      v-if="project.galleryImages.length"
      class="py-20 bg-brand-yellow-500"
    >
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-2xl md:text-3xl font-bold text-brand-dark">
            Design Highlights
          </h2>
          <div class="flex gap-3">
            <button
              class="w-10 h-10 rounded-full border-2 border-brand-dark/30 flex items-center justify-center text-brand-dark hover:bg-brand-dark/10 transition-colors disabled:opacity-30"
              :disabled="galleryIndex === 0"
              @click="galleryIndex = Math.max(0, galleryIndex - 1)"
            >
              ←
            </button>
            <button
              class="w-10 h-10 rounded-full border-2 border-brand-dark/30 flex items-center justify-center text-brand-dark hover:bg-brand-dark/10 transition-colors disabled:opacity-30"
              :disabled="galleryIndex >= project.galleryImages.length - 1"
              @click="galleryIndex = Math.min(project.galleryImages.length - 1, galleryIndex + 1)"
            >
              →
            </button>
          </div>
        </div>
        <div class="rounded-2xl overflow-hidden">
          <img
            :src="project.galleryImages[galleryIndex]"
            :alt="`${project.title} design highlight ${galleryIndex + 1}`"
            class="w-full object-contain max-h-[600px]"
          >
        </div>
      </div>
    </section>

    <!-- Next project CTA -->
    <section class="py-16 bg-brand-dark text-center">
      <div class="max-w-xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-white mb-6">
          Ready to create something like this?
        </h2>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-brand-yellow-500 text-brand-dark font-bold rounded-full text-sm hover:bg-brand-yellow-400 transition-colors"
        >
          Start Your Project →
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
