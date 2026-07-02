<script setup lang="ts">
const logos = [
  { src: '/Images/Client_Logo/le_crown_brown-01_1@2x.png', alt: 'Le Crown Hotel' },
  { src: '/Images/Client_Logo/COLOR_2_1@2x.png', alt: 'Take My Family' },
  { src: '/Images/Client_Logo/IMG_3097_1@2x.png', alt: 'TAB' },
  { src: '/Images/Client_Logo/Pink_Label_logo_1@2x.png', alt: 'Pinklabel' },
  { src: '/Images/Client_Logo/Asset_1@500x_1@2x.png', alt: 'Piok English' },
  { src: '/Images/Client_Logo/Asset_1@500x_2@2x.png', alt: 'Go German' }
]
</script>

<template>
  <div class="relative w-full overflow-hidden py-4">
    <!-- Fading edges mask -->
    <div class="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
    <div class="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

    <div class="flex w-max gap-16 md:gap-20 animate-marquee whitespace-nowrap">
      <!-- First set of logos -->
      <div class="flex items-center gap-16 md:gap-20 shrink-0">
        <NuxtImg
          v-for="(logo, idx) in logos"
          :key="`first-${idx}`"
          :src="logo.src"
          :alt="logo.alt"
          loading="lazy"
          format="webp"
          class="h-9 md:h-11 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </div>
      <!-- Duplicate set for seamless looping -->
      <div
        class="flex items-center gap-16 md:gap-20 shrink-0"
        aria-hidden="true"
      >
        <NuxtImg
          v-for="(logo, idx) in logos"
          :key="`second-${idx}`"
          :src="logo.src"
          :alt="logo.alt"
          loading="lazy"
          format="webp"
          class="h-9 md:h-11 w-auto object-contain grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}
.animate-marquee {
  display: flex;
  width: max-content;
  animation: marquee 25s linear infinite;
}
.animate-marquee:hover {
  animation-play-state: paused;
}
</style>
