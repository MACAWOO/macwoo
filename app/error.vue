<script setup lang="ts">
defineProps<{ error: { statusCode: number, statusMessage?: string, message?: string } }>()

function goHome() {
  clearError({ redirect: '/' })
}

// Bright center column, fading toward both edges
function columnAlpha(i: number) {
  const center = 7
  const dist = Math.abs(i - center)
  return Math.max(0.12, 0.85 - dist * 0.11)
}
</script>

<template>
  <div class="min-h-screen bg-white relative overflow-hidden flex flex-col">
    <!-- Yellow column pattern background -->
    <div
      class="absolute inset-y-0 right-0 w-[62%] flex pointer-events-none"
      aria-hidden="true"
    >
      <div
        v-for="i in 13"
        :key="i"
        class="flex-1"
        :style="`background: linear-gradient(to bottom, rgba(237,224,0,${columnAlpha(i)}) 0%, rgba(237,224,0,0) 95%)`"
      />
    </div>

    <!-- Content -->
    <div class="relative z-10 flex flex-col min-h-screen p-8">
      <!-- Logo -->
      <div>
        <img
          src="/Images/Logo.png"
          alt="Macawoo"
          class="h-10 w-auto"
        >
      </div>

      <!-- Error message -->
      <div class="flex-1 flex flex-col justify-center max-w-2xl pt-16">
        <h1 class="text-5xl md:text-7xl font-medium text-brand-teal-500 leading-tight mb-6">
          OOPS,<br>Something went<br>wrong :(
        </h1>
        <p class="text-zinc-600 text-sm mb-10">
          We couldn't find the page you were looking for.
        </p>
        <button
          class="group/cta inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full hover:bg-brand-yellow-400 transition-colors w-fit"
          @click="goHome"
        >
          Back to Home
          <UpRightArrow
            class="w-[14px] h-[14px] shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
          />
        </button>
      </div>
    </div>
  </div>
</template>
