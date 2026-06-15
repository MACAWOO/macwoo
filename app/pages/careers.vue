<script setup lang="ts">
const { jobs, fetchPromise: careersPromise } = useCareers()
if (careersPromise) {
  await careersPromise
}

const { settings, fetchPromise: settingsPromise } = usePageSettings()
if (settingsPromise) {
  await settingsPromise
}

useSeoMeta({
  title: 'Careers at Macawoo — Join Our Creative & Strategy Team',
  description: 'Build your future with Macawoo. We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation.',
  ogTitle: 'Careers at Macawoo — Join Our Creative & Strategy Team',
  ogDescription: 'Build your future with Macawoo. We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation.'
})

const siteUrl = 'https://www.macawoo.in'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${siteUrl}/careers#webpage`,
        'url': `${siteUrl}/careers`,
        'name': 'Careers at Macawoo — Join Our Creative & Strategy Team',
        'description': 'Build your future with Macawoo. Join us in crafting digital experiences that demand attention and drive transformation.',
        'isPartOf': { '@id': `${siteUrl}/#website` }
      })
    }
  ]
})

const isModalOpen = ref(false)

const handleJobClick = (job: typeof jobs.value[number]) => {
  if (job.applyUrl) {
    window.open(job.applyUrl, '_blank', 'noopener,noreferrer')
  } else {
    isModalOpen.value = true
  }
}
</script>

<template>
  <div class="relative bg-brand-dark">
    <!-- Absolute Back button -->
    <NuxtLink
      to="/"
      class="absolute top-8 left-8 z-30 inline-flex items-center gap-2 px-5 py-2.5 bg-white text-brand-dark rounded-full text-sm font-bold shadow-md hover:scale-105 hover:bg-zinc-50 transition-all cursor-pointer border border-zinc-200/50"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="w-4 h-4 text-brand-dark"
      />
      Back
    </NuxtLink>

    <!-- Page Hero -->
    <PageHero
      title-html="<span class='text-brand-yellow-500'>Build Your Future<br>With Macawoo</span>"
      :video="settings.careersHeroVideo"
      :image="settings.careersHeroImage"
      description="We are a collection of visionaries, builders, and storytellers. Join us in crafting digital experiences that demand attention and drive transformation."
      :ctas="[{ label: 'View Open Roles ↓', to: '#open-roles', variant: 'white' }]"
      show-grid
      min-height=""
      class="custom-hero-ratio"
    />

    <!-- We Engineer Digital Excellence -->
    <section class="py-20 bg-[#1D96B8] text-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-16 items-center">
          <!-- Left side Content (2/3 width on desktop) -->
          <div class="lg:w-7/12 flex flex-col items-start">
            <h2 class="text-3xl md:text-[46px] font-medium text-brand-yellow-500 mb-6 leading-tight font-sans uppercase tracking-wide">
              We Engineer<br>Digital Excellence.
            </h2>
            <p class="text-white text-base md:text-lg leading-relaxed mb-10 max-w-xl font-sans font-normal">
              At Macawoo, we don't just execute; we architect. We value raw creative energy paired with executive-level precision. Here, your work isn't just a project—it's a strategic asset for ambitious founders. We foster an environment where bold ideas are stress-tested and brilliant execution is the baseline.
            </p>
            <!-- Two yellow cards -->
            <div class="grid sm:grid-cols-2 gap-6 w-full">
              <div class="bg-brand-yellow-500 text-brand-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-3">
                    <UIcon
                      name="i-lucide-rocket"
                      class="w-6 h-6 text-brand-dark"
                    />
                  </div>
                  <h3 class="font-medium text-brand-dark text-sm mb-1 uppercase tracking-wider">
                    Accelerated Growth
                  </h3>
                  <p class="text-brand-dark/80 text-xs leading-relaxed font-medium">
                    Continuous learning and opportunities to lead high-impact initiatives.
                  </p>
                </div>
              </div>
              <div class="bg-brand-yellow-500 text-brand-dark rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[140px]">
                <div>
                  <div class="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-3">
                    <UIcon
                      name="i-lucide-users"
                      class="w-6 h-6 text-brand-dark"
                    />
                  </div>
                  <h3 class="font-medium text-brand-dark text-sm mb-1 uppercase tracking-wider">
                    Visionary Team
                  </h3>
                  <p class="text-brand-dark/80 text-xs leading-relaxed font-medium">
                    Collaborate with top-tier talent pushing the boundaries of design and tech.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- Right side Placeholder Card (1/3 width on desktop) -->
          <div class="lg:w-5/12 w-full flex justify-center lg:justify-end">
            <div class="relative w-full max-w-[380px] aspect-[3/4] bg-zinc-200 rounded-[2.5rem] shadow-md border border-white/10" />
          </div>
        </div>
      </div>
    </section>

    <!-- Open Roles -->
    <section
      id="open-roles"
      class="py-20 bg-[#1D96B8] text-white"
    >
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-[46px] font-medium text-brand-yellow-500 mb-2 uppercase tracking-wide">
          Open Roles
        </h2>
        <p class="text-white/80 text-sm mb-12">
          Find your place among the visionaries.
        </p>

        <div class="border-t border-brand-yellow-500">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="border-b border-brand-yellow-500 py-8 flex flex-col md:flex-row md:items-center justify-between gap-6 cursor-pointer group transition-colors duration-200"
            @click="handleJobClick(job)"
          >
            <!-- Left Side: Dept/Loc + Job Title -->
            <div class="flex-1">
              <p class="text-white/70 text-xs font-semibold uppercase tracking-wider mb-2">
                {{ job.department }} · {{ job.location }}
              </p>
              <h3 class="text-2xl md:text-3xl lg:text-[36px] font-medium text-brand-yellow-500 uppercase tracking-wide group-hover:text-white transition-colors duration-200">
                {{ job.title }}
              </h3>
            </div>

            <!-- Right Side: Experience + Type Pill + Yellow Arrow -->
            <div class="flex items-center gap-6 md:gap-8 shrink-0 flex-wrap sm:flex-nowrap">
              <span class="text-white text-sm md:text-base font-semibold tracking-wide">
                {{ job.experience }}
              </span>
              <span class="text-white text-xs font-bold border border-white px-5 py-2 rounded-full tracking-wider uppercase">
                {{ job.type }}
              </span>
              <!-- Arrow icon -->
              <UIcon
                name="i-lucide-arrow-up-right"
                class="w-8 h-8 md:w-10 md:h-10 text-brand-yellow-500 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 duration-200"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalCareers v-model="isModalOpen" />
  </div>
</template>
