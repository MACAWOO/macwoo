<script setup lang="ts">
defineProps<{ error: { statusCode: number, statusMessage?: string, message?: string } }>()

function goHome() {
  clearError({ redirect: '/' })
}
</script>

<template>
  <div class="min-h-screen bg-white relative overflow-hidden flex flex-col">
    <!-- Yellow column pattern background -->
    <div
      class="absolute inset-0 flex gap-3 opacity-30 pointer-events-none"
      aria-hidden="true"
    >
      <div
        v-for="i in 14"
        :key="i"
        class="flex-1 rounded-full"
        :style="`background: linear-gradient(to bottom, #EDE000 ${i % 3 === 0 ? '40%' : i % 3 === 1 ? '60%' : '50%'}, transparent 100%)`"
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
          class="inline-flex items-center gap-2 px-6 py-3 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full hover:bg-brand-yellow-400 transition-colors w-fit"
          @click="goHome"
        >
          Back to Home ×
        </button>
      </div>
    </div>
  </div>
</template>
