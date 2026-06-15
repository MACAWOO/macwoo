<script setup lang="ts">
const { settings, fetchPromise: settingsPromise } = usePageSettings()
if (settingsPromise) {
  await settingsPromise
}

useSeoMeta({
  title: 'About Macawoo — Creative Strategy & Branding Agency',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
  ogTitle: 'About Macawoo — Creative Strategy & Branding Agency',
  ogDescription: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
})

const siteUrl = 'https://www.macawoo.in'
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        '@id': `${siteUrl}/about#webpage`,
        'url': `${siteUrl}/about`,
        'name': 'About Macawoo — Creative Strategy & Branding Agency',
        'description': 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
        'isPartOf': { '@id': `${siteUrl}/#website` }
      })
    }
  ]
})
</script>

<template>
  <div>
    <!-- Page Hero -->
    <PageHero
      title-html="About Us"
      :video="settings.aboutHeroVideo"
      :image="settings.aboutHeroImage"
      show-grid
      class="custom-hero-ratio"
    />

    <!-- Who We Are Section -->
    <section class="bg-[#F8F9FA] py-16 md:py-24 text-center">
      <div class="max-w-[1266px] mx-auto px-6">
        <p
          class="text-[#0596B8] text-xs font-semibold uppercase tracking-[0.18em] mb-6"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Who We Are
        </p>
        <p
          class="text-brand-dark text-2xl md:text-3xl lg:text-[40px] font-semibold leading-[1.3] max-w-5xl mx-auto"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.
        </p>
      </div>
    </section>

    <!-- What We Believe Section -->
    <section class="bg-[#0596B8] py-16 md:py-24 text-white">
      <div class="max-w-[1266px] mx-auto px-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <!-- Left column: Visual rounded box -->
          <div class="rounded-[2.5rem] overflow-hidden w-full h-[320px] md:h-[450px]">
            <NuxtImg
              src="/Images/what_we_believe.png"
              alt="What We Believe"
              loading="lazy"
              format="webp"
              class="w-full h-full object-cover"
            />
          </div>

          <!-- Right column -->
          <div class="flex flex-col gap-6">
            <!-- Top bar -->
            <div class="flex items-center justify-between">
              <span
                class="text-white/80 text-xs font-semibold uppercase tracking-[0.18em]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >What we believe</span>
              <!-- Yellow badge speech bubble -->
            </div>

            <!-- Heading -->
            <h2
              class="text-brand-yellow-500 text-3xl md:text-4xl lg:text-[46px] font-medium leading-tight"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              "Brands should be felt,<br>not just seen."
            </h2>

            <!-- Paragraph -->
            <p
              class="text-white text-base md:text-lg leading-relaxed font-normal"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              We believe great brands create meaningful connections. Through strategy, creativity, and execution, we help businesses build experiences that inspire trust, spark engagement, and drive growth.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Work Section -->
    <section class="bg-brand-yellow-500 py-16 md:py-24">
      <div class="max-w-[1266px] mx-auto px-6">
        <!-- Title -->
        <h2
          class="text-[#0596B8] text-3xl md:text-4xl lg:text-[48px] font-medium mb-12"
          style="font-family: 'Fredoka', sans-serif;"
        >
          How We Work
        </h2>

        <!-- Cards Grid Container -->
        <div class="relative">
          <!-- Connecting Line (Desktop) -->
          <div class="hidden md:block absolute left-[15%] right-[15%] top-16 h-[2px] border-t-2 border-dashed border-[#0596B8]/30 z-0" />

          <!-- Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            <!-- Strategy Card -->
            <div
              class="bg-[#0596B8] rounded-[1.25rem] p-8 md:p-10 text-white flex flex-col items-start"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              <div class="w-12 h-12 rounded-full border border-white/30 bg-[#0596B8] flex items-center justify-center text-white mb-6 relative z-10">
                <UIcon
                  name="i-lucide-compass"
                  class="w-6 h-6"
                />
              </div>
              <h3 class="font-medium text-xl md:text-2xl mb-3">
                Strategy
              </h3>
              <p class="text-white/90 text-sm md:text-base leading-relaxed">
                We lay the foundation. Deep research and sharp insights inform every creative decision, ensuring your brand is built to win.
              </p>
            </div>

            <!-- Creativity Card -->
            <div
              class="bg-[#0596B8] rounded-[1.25rem] p-8 md:p-10 text-white flex flex-col items-start"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              <div class="w-12 h-12 rounded-full border border-white/30 bg-[#0596B8] flex items-center justify-center text-white mb-6 relative z-10">
                <UIcon
                  name="i-lucide-palette"
                  class="w-6 h-6"
                />
              </div>
              <h3 class="font-medium text-xl md:text-2xl mb-3">
                Creativity
              </h3>
              <p class="text-white/90 text-sm md:text-base leading-relaxed">
                We bring ideas to life. Bold design, compelling storytelling, and high-fidelity visuals that capture the imagination.
              </p>
            </div>

            <!-- Growth Card -->
            <div
              class="bg-[#0596B8] rounded-[1.25rem] p-8 md:p-10 text-white flex flex-col items-start"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              <div class="w-12 h-12 rounded-full border border-white/30 bg-[#0596B8] flex items-center justify-center text-white mb-6 relative z-10">
                <UIcon
                  name="i-lucide-trending-up"
                  class="w-6 h-6"
                />
              </div>
              <h3 class="font-medium text-xl md:text-2xl mb-3">
                Growth
              </h3>
              <p class="text-white/90 text-sm md:text-base leading-relaxed">
                We scale the impact. Execution that converts, campaigns that sustain, and a brand presence that dominates the market.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Vision Section -->
    <section class="bg-[#0596B8] py-16 md:py-24 text-white text-center">
      <div class="max-w-[1266px] mx-auto px-6">
        <p
          class="text-white/80 text-xs font-semibold uppercase tracking-[0.18em] mb-6"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Vision
        </p>
        <p
          class="text-white text-xl md:text-2xl lg:text-[28px] font-semibold leading-[1.6] max-w-5xl mx-auto"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          We envision a world where every brand creates a lasting impression, transforming simple interactions into meaningful connections. By combining creativity, strategy, and innovation, we help businesses build distinctive identities that people don't just notice—but genuinely remember, trust, and connect with for years to come.
        </p>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="bg-brand-yellow-500 py-20 md:py-28 text-center flex flex-col items-center justify-center">
      <div class="max-w-4xl mx-auto px-6">
        <h2
          class="text-[#0596B8] text-3xl md:text-5xl lg:text-[56px] font-medium leading-tight mb-6"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          To create brands that people don't just notice—but remember.
        </h2>
        <p
          class="text-brand-dark/70 text-sm md:text-base font-semibold mb-8 uppercase tracking-wider"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Let's Build Something Powerful
        </p>
        <NuxtLink
          to="/contact"
          class="inline-flex items-center gap-2 px-8 py-4 bg-[#0596B8] text-white font-bold rounded-full text-sm hover:bg-[#0596B8]/90 transition-colors"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          Start Your Project <UpRightArrow
            class="w-[14px] h-[14px] shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
          />
        </NuxtLink>
      </div>
    </section>
  </div>
</template>
