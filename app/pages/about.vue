<script setup lang="ts">
useSeoMeta({
  title: 'About — Macawoo',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
})
</script>

<template>
  <div>
    <!-- Hero -->
    <PageHero
      title-html="Built for Brands That<br>Want to Stand Out."
      video="/Background%20Videos/About.mp4"
      image="/Images/Branding.jpeg"
      description="We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth."
    />

    <!-- Who We Are -->
    <section class="py-16 bg-brand-yellow-500">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-brand-dark/60 text-xs font-semibold uppercase tracking-widest mb-4">
          Who We Are
        </p>
        <p class="text-brand-dark text-xl md:text-2xl font-medium leading-relaxed max-w-3xl">
          We are a creative &amp; strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.
        </p>
      </div>
    </section>

    <!-- Quote -->
    <section class="py-20 bg-brand-teal-500">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="md:w-2/3">
            <p class="text-white/50 text-xs font-semibold uppercase tracking-widest mb-6">
              What We Believe
            </p>
            <h2 class="text-4xl md:text-5xl font-bold italic text-white leading-tight mb-8">
              "Brands should be felt,<br>not just seen."
            </h2>
          </div>
          <div class="md:w-1/3">
            <div class="w-16 h-16 bg-brand-yellow-500 rounded-2xl flex items-center justify-center mb-6">
              <span class="text-brand-dark font-bold text-3xl leading-none">m</span>
            </div>
            <p class="text-white/80 text-sm leading-relaxed">
              We believe great brands create meaningful connections. Through strategy, creativity, and execution, we help businesses build experiences that inspire trust, spark engagement, and drive growth.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- How We Work -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl md:text-4xl font-bold text-brand-dark mb-12">
          How We Work
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 bg-brand-teal-50 rounded-xl flex items-center justify-center">
              <img
                src="/Icons/Lightbulb@4x.png"
                alt="Strategy"
                class="w-7 h-7 object-contain"
              >
            </div>
            <h3 class="font-bold text-brand-dark text-xl">
              Strategy
            </h3>
            <p class="text-zinc-600 text-sm leading-relaxed">
              Every great brand begins with a clear strategic foundation. We research, analyse, and define the positioning that will make your brand impossible to ignore.
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 bg-brand-teal-50 rounded-xl flex items-center justify-center">
              <img
                src="/Icons/Palette@4x.png"
                alt="Creativity"
                class="w-7 h-7 object-contain"
              >
            </div>
            <h3 class="font-bold text-brand-dark text-xl">
              Creativity
            </h3>
            <p class="text-zinc-600 text-sm leading-relaxed">
              We bring ideas to life with craft and intentionality. From visual identity to campaign concepts, creativity is the engine behind everything we produce.
            </p>
          </div>
          <div class="flex flex-col gap-4">
            <div class="w-12 h-12 bg-brand-teal-50 rounded-xl flex items-center justify-center">
              <img
                src="/Icons/Chart%20Spline@4x.png"
                alt="Execution"
                class="w-7 h-7 object-contain"
              >
            </div>
            <h3 class="font-bold text-brand-dark text-xl">
              Execution
            </h3>
            <p class="text-zinc-600 text-sm leading-relaxed">
              Ideas without execution are just ideas. We follow through with precision — launching, measuring, and optimising until the work delivers real results.
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Mission -->
    <section class="py-16 bg-zinc-50">
      <div class="max-w-7xl mx-auto px-6">
        <p class="text-brand-teal-500 text-xs font-semibold uppercase tracking-widest mb-6">
          Our Mission
        </p>
        <p class="text-brand-dark text-xl md:text-2xl leading-relaxed max-w-4xl">
          We envision a world where every brand creates a lasting impression, transforming simple interactions into meaningful connections. By combining creativity, strategy, and innovation, we help businesses build distinctive identities that don't just get noticed — but genuinely remembered, trusted, and connected with for years to come.
        </p>
      </div>
    </section>

    <!-- CTA -->
    <section class="py-20 bg-brand-yellow-500 text-center">
      <div class="max-w-3xl mx-auto px-6">
        <h2 class="text-3xl md:text-5xl font-bold text-brand-dark leading-snug mb-8">
          To create brands that people don't just notice — but remember.
        </h2>
        <p class="text-brand-dark/60 text-sm mb-8">
          Let's Build Something Together
        </p>
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
