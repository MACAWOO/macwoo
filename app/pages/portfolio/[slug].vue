<script setup lang="ts">
const { projects, fetchPromise } = usePortfolio()
if (fetchPromise) {
  await fetchPromise
}

const route = useRoute()
const slug = route.params.slug as string
const project = computed(() => projects.value.find(p => p.slug === slug))

if (!project.value) {
  throw createError({ statusCode: 404, statusMessage: 'Project not found', fatal: true })
}

useSeoMeta({
  title: () => project.value ? `${project.value.title} — Macawoo Portfolio` : 'Macawoo Portfolio',
  description: () => project.value ? (project.value.tagline ?? project.value.subtitle) : '',
  ogTitle: () => project.value ? `${project.value.title} — Macawoo Portfolio` : 'Macawoo Portfolio',
  ogDescription: () => project.value ? (project.value.tagline ?? project.value.subtitle) : ''
})

const galleryIndex = ref(0)

const paragraphs = computed(() =>
  project.value?.storyParagraphs?.length
    ? project.value.storyParagraphs
    : [project.value?.story ?? '']
)
</script>

<template>
  <div
    v-if="project"
    class="bg-white"
  >
    <!-- ── Hero ── -->
    <div class="relative">
      <!-- dark left-to-right gradient -->
      <div
        class="absolute inset-0 z-10 pointer-events-none"
        style="background: linear-gradient(90deg, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0) 55%)"
      />

      <!-- back button -->
      <NuxtLink
        to="/portfolio"
        class="absolute top-8 left-6 md:left-[120px] z-20 bg-white inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full hover:opacity-90 transition-opacity"
      >
        <svg
          class="w-4 h-4 text-brand-dark"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M10 12L6 8L10 4"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        <span class="font-extrabold text-brand-dark text-sm">Back</span>
      </NuxtLink>

      <!-- hero image -->
      <NuxtImg
        :src="project.heroImage"
        :alt="project.title"
        preload
        format="webp"
        class="w-full h-[360px] md:h-[560px] lg:h-[640px] object-cover"
      />
    </div>

    <!-- ── Teal Info Section ── -->
    <div class="bg-[#1D96B8] px-6 md:px-[120px] py-16">
      <!-- metadata pills -->
      <div class="flex flex-wrap gap-2 mb-7">
        <!-- services pill -->
        <span
          v-if="project.services"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-3.5 h-3.5 shrink-0"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="1"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="8"
              y="1"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="1"
              y="8"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
            <rect
              x="8"
              y="8"
              width="5"
              height="5"
              rx="1"
              stroke="white"
              stroke-width="1.5"
            />
          </svg>
          {{ project.services }}
        </span>

        <!-- industry pill -->
        <span
          v-if="project.industry"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-5 h-5 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3 21h18M6 21V7l6-4 6 4v14M9 21v-5h6v5"
              stroke="white"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          {{ project.industry }}
        </span>

        <!-- date pill -->
        <span
          v-if="project.date"
          class="border border-white text-white text-base font-normal leading-[28px] px-3 py-2 rounded-[56px] inline-flex items-center gap-1.5"
        >
          <svg
            class="w-3 h-3 shrink-0"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="1"
              y="2"
              width="10"
              height="9"
              rx="1.5"
              stroke="white"
              stroke-width="1.2"
            />
            <path
              d="M4 1v2M8 1v2"
              stroke="white"
              stroke-width="1.2"
              stroke-linecap="round"
            />
            <path
              d="M1 5h10"
              stroke="white"
              stroke-width="1.2"
            />
          </svg>
          {{ project.date }}
        </span>
      </div>

      <!-- title -->
      <h1
        class="font-fredoka font-medium text-[56px] md:text-[64px] text-brand-yellow-500 leading-tight mb-3"
        style="font-variation-settings: 'wdth' 100"
      >
        {{ project.title }}
      </h1>

      <!-- tagline -->
      <p
        v-if="project.tagline"
        class="text-white text-lg leading-[24px] max-w-2xl"
      >
        {{ project.tagline }}
      </p>
    </div>

    <!-- ── Story Section ── -->
    <div class="bg-white px-6 md:px-[120px] py-16">
      <h2
        class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#1D96B8] mb-5 leading-tight"
        style="font-variation-settings: 'wdth' 100"
      >
        The Story Behind the Project
      </h2>
      <div class="space-y-5 max-w-[1200px]">
        <p
          v-for="(para, i) in paragraphs"
          :key="i"
          class="text-brand-dark text-lg leading-[24px]"
        >
          {{ para }}
        </p>
      </div>
    </div>

    <!-- ── Design Highlights ── -->
    <div
      v-if="project.galleryImages.length"
      class="bg-brand-yellow-500 px-6 md:px-[120px] py-16"
    >
      <h2
        class="font-fredoka font-medium text-[40px] md:text-[48px] text-[#1D96B8] mb-5 leading-tight"
        style="font-variation-settings: 'wdth' 100"
      >
        Design Highlights
      </h2>

      <div class="relative rounded-[28px] overflow-hidden">
        <NuxtImg
          :src="project.galleryImages[galleryIndex]"
          :alt="`${project.title} design highlight ${galleryIndex + 1}`"
          format="webp"
          class="w-full object-cover rounded-[28px]"
          style="min-height: 280px; max-height: 619px;"
        />

        <!-- prev / next buttons -->
        <div
          v-if="project.galleryImages.length > 1"
          class="absolute bottom-5 right-5 flex gap-2"
        >
          <button
            class="w-14 h-14 rounded-full bg-brand-yellow-500 border-2 border-brand-yellow-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            :disabled="galleryIndex === 0"
            @click="galleryIndex = Math.max(0, galleryIndex - 1)"
          >
            <LeftArrow class="w-5 h-5 text-brand-dark" />
          </button>
          <button
            class="w-14 h-14 rounded-full bg-brand-yellow-500 border-2 border-brand-yellow-500 flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-30"
            :disabled="galleryIndex >= project.galleryImages.length - 1"
            @click="galleryIndex = Math.min(project.galleryImages.length - 1, galleryIndex + 1)"
          >
            <RightArrow class="w-5 h-5 text-brand-dark" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
