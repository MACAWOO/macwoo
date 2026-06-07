<script setup lang="ts">
const { jobs } = useCareers()

useSeoMeta({
  title: 'Careers — Macawoo',
  description: 'Build your future with Macawoo. We are a collection of creatives, thinkers, and storytellers who push each other to lead high-impact initiatives.'
})

const isModalOpen = ref(false)
</script>

<template>
  <div>
    <PageHero
      variant="teal"
      title-html="Build Your Future<br>With <em class='not-italic text-brand-yellow-500'>Macawoo</em>"
      video="/Background%20Videos/Careers.mp4"
      image="/Images/Marketing.jpeg"
      description="We are a collection of creatives, thinkers, and storytellers. Your work isn't just a project — it's a strategic asset."
      :ctas="[{ label: 'View Open Roles ↓', to: '#open-roles' }]"
    />

    <!-- We Engineer Digital Excellence -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="md:w-2/3">
            <h2 class="text-3xl md:text-4xl font-bold text-brand-teal-500 mb-6 leading-snug">
              We Engineer<br>Digital Excellence.
            </h2>
            <p class="text-zinc-600 text-base leading-relaxed mb-10 max-w-xl">
              At Macawoo, we don't just execute; we architect. We value raw creative energy paired with executive-level precision. Here, your work isn't just a project — it's a strategic asset for ambitious founders. We foster an environment where bold ideas are stress-tested and brilliant execution is the baseline.
            </p>
            <div class="grid sm:grid-cols-2 gap-6">
              <div class="bg-zinc-50 rounded-2xl p-6">
                <div class="flex gap-3 items-start">
                  <div class="w-8 h-8 bg-brand-yellow-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      class="w-4 h-4 text-brand-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-brand-dark text-sm mb-1">
                      Accelerated Growth
                    </h3>
                    <p class="text-zinc-500 text-xs leading-relaxed">
                      Continuous learning and opportunities to lead high-impact initiatives.
                    </p>
                  </div>
                </div>
              </div>
              <div class="bg-zinc-50 rounded-2xl p-6">
                <div class="flex gap-3 items-start">
                  <div class="w-8 h-8 bg-brand-yellow-500 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      class="w-4 h-4 text-brand-dark"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h3 class="font-bold text-brand-dark text-sm mb-1">
                      Visionary Team
                    </h3>
                    <p class="text-zinc-500 text-xs leading-relaxed">
                      Collaborate with top-tier talent pushing the boundaries of design and tech.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="md:w-1/3 flex justify-center md:justify-end">
            <div class="w-32 h-32 bg-brand-yellow-500 rounded-3xl flex items-center justify-center">
              <span class="text-brand-dark font-bold text-7xl leading-none">m</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Open Roles -->
    <section
      id="open-roles"
      class="py-16 bg-zinc-50"
    >
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-brand-dark mb-2">
          Open Roles
        </h2>
        <p class="text-zinc-500 text-sm mb-10">
          Find your place among the extraordinary.
        </p>

        <div class="space-y-4">
          <div
            v-for="job in jobs"
            :key="job.id"
            class="bg-white rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div class="flex-1">
              <p class="text-zinc-500 text-xs mb-1">
                {{ job.department }} · {{ job.location }}
              </p>
              <h3 class="text-xl md:text-2xl font-bold text-brand-teal-500">
                {{ job.title }}
              </h3>
            </div>
            <div class="flex items-center gap-3 shrink-0">
              <span class="text-xs font-medium text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">{{ job.experience }}</span>
              <button
                class="px-5 py-2 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full hover:bg-brand-yellow-400 transition-colors flex items-center gap-2"
                @click="isModalOpen = true"
              >
                Apply Now ↗
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <ModalCareers v-model="isModalOpen" />
  </div>
</template>
