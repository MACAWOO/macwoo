<script setup lang="ts">
useSeoMeta({
  title: 'Digital Marketing — Macawoo',
  description: 'Data-driven campaigns that reach the right audience, tell the right story, and deliver measurable results.'
})

const serviceOrder = ['/services/branding-design', '/services/digital-marketing', '/services/video-production']
const currentIndex = 1
const prevTo = serviceOrder[(currentIndex - 1 + 3) % 3]
const nextTo = serviceOrder[(currentIndex + 1) % 3]

const subServices = [
  { icon: '/Icons/File%20Search@4x.png', title: 'Content Marketing', description: 'Strategic content that educates, engages, and builds lasting trust with your audience.' },
  { icon: '/Icons/Chart%20Spline@4x.png', title: 'Performance Marketing', description: 'Paid campaigns optimised for maximum ROI across Google, Meta, and beyond.' },
  { icon: '/Icons/Chart%20No%20Axes%20Combined@4x.png', title: 'Organic Growth', description: 'SEO and organic strategies that compound over time and drive sustainable traffic.' },
  { icon: '/Icons/Megaphone@4x.png', title: 'Social Media Marketing', description: 'Platform-native content and community strategies that grow engaged audiences.' },
  { icon: '/Icons/Device%20Mobile@4x.png', title: 'Influencer Marketing', description: 'Strategic collaborations with creators that amplify your brand to new audiences.' },
  { icon: '/Icons/Brain@4x.png', title: 'Strategy & Analytics', description: 'Data-driven insights and reporting that inform every marketing decision.' }
]
</script>

<template>
  <div>
    <PageHero
      title-html="Digital Marketing"
      image="/Images/Digital%20Marketing.jpeg"
      eyebrow="SERVICES"
      description="Data-driven campaigns that reach the right audience, tell the right story, and deliver measurable results."
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
          Brands We've Grown
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
            v-for="(step, i) in ['Discover', 'Define', 'Design', 'Deliver']"
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
                Understanding your audience, market, and objectives in depth.
              </template>
              <template v-else-if="i === 1">
                Defining the channels, tactics, and KPIs that matter.
              </template>
              <template v-else-if="i === 2">
                Creating compelling campaigns and content.
              </template>
              <template v-else>
                Launching, optimising, and scaling for performance.
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
          Growth Isn't Luck. It's Strategy.
        </h2>
        <p class="text-zinc-500 text-sm mb-8">
          Let's build a marketing engine that performs.
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
