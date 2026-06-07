<script setup lang="ts">
useSeoMeta({
  title: 'Video Production — Macawoo',
  description: 'From concept to final cut, we produce video content that commands attention and drives meaningful engagement.'
})

const serviceOrder = ['/services/branding-design', '/services/digital-marketing', '/services/video-production']
const currentIndex = 2
const prevTo = serviceOrder[(currentIndex - 1 + 3) % 3]
const nextTo = serviceOrder[(currentIndex + 1) % 3]

const subServices = [
  { icon: '/Icons/Film@4x.png', title: 'Brand Films', description: 'Cinematic brand films that tell your story and create an emotional connection with your audience.' },
  { icon: '/Icons/Film%20Strip@4x.png', title: 'Social Media Reels', description: 'Short-form video content engineered for engagement, shareability, and platform performance.' },
  { icon: '/Icons/Video%20Camera@4x.png', title: 'Product Videography', description: 'High-quality product videos that showcase your offering and drive purchase intent.' },
  { icon: '/Icons/Film%20Slate@4x.png', title: 'Corporate Videos', description: 'Professional corporate content for presentations, pitches, and stakeholder communications.' },
  { icon: '/Icons/Video@4x.png', title: 'Event Coverage', description: 'Comprehensive event documentation that captures key moments and extends your event\'s reach.' },
  { icon: '/Icons/Scissors%20Line%20Dashed@4x.png', title: 'Post-Production', description: 'Expert editing, colour grading, motion graphics, and sound design to elevate your content.' }
]
</script>

<template>
  <div>
    <PageHero
      title-html="Video Production"
      image="/Images/Video%20Production.jpeg"
      eyebrow="SERVICES"
      description="From concept to final cut, we produce video content that commands attention and drives meaningful engagement."
      :show-arrows="true"
      :prev-to="prevTo"
      :next-to="nextTo"
    />

    <!-- Sub-services grid -->
    <section class="py-20 bg-brand-teal-500 relative overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
          <ServiceCard
            v-for="s in subServices"
            :key="s.title"
            :icon="s.icon"
            :title="s.title"
            :description="s.description"
          />
        </div>
      </div>
      <div class="absolute top-8 right-8 w-16 h-16 bg-brand-yellow-500 rounded-2xl flex items-center justify-center opacity-80">
        <span class="text-brand-dark font-bold text-3xl leading-none">m</span>
      </div>
    </section>

    <!-- Client logos -->
    <section class="py-14 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-center text-zinc-400 text-xs font-semibold uppercase tracking-widest mb-8">
          Brands We've Filmed
        </p>
        <ClientLogos />
      </div>
    </section>

    <!-- Methodology -->
    <section class="py-20 bg-brand-yellow-500">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl md:text-3xl font-bold text-brand-dark mb-12">
          The Methodology
        </h2>
        <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div
            v-for="(step, i) in ['Concept', 'Pre-Production', 'Production', 'Post-Production']"
            :key="step"
            class="bg-brand-dark rounded-2xl p-6"
          >
            <p class="text-brand-yellow-500 text-3xl font-bold mb-4">
              0{{ i + 1 }}
            </p>
            <h3 class="text-white font-bold text-lg mb-2">
              {{ step }}
            </h3>
            <p class="text-white/60 text-xs leading-relaxed">
              <template v-if="i === 0">
                Developing the creative vision and narrative direction.
              </template>
              <template v-else-if="i === 1">
                Planning every detail — scripting, casting, locations, and scheduling.
              </template>
              <template v-else-if="i === 2">
                Filming with professional-grade equipment and experienced crew.
              </template>
              <template v-else>
                Editing, grading, sound design, and delivery in all required formats.
              </template>
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-white text-center">
      <div class="max-w-xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-dark mb-3">
          Ready to Command Attention?
        </h2>
        <p class="text-zinc-500 text-sm mb-8">
          Let's create video content that stops the scroll.
        </p>
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
