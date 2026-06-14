<script setup lang="ts">
const isOpen = defineModel<boolean>({ default: false })
</script>

<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-[100] flex items-center justify-center p-4"
  >
    <!-- Backdrop -->
    <div
      class="absolute inset-0 bg-black/50 backdrop-blur-sm"
      @click="isOpen = false"
    />

    <!-- Modal -->
    <div class="relative bg-white rounded-2xl w-full max-w-lg p-8 shadow-2xl">
      <!-- Close -->
      <button
        class="absolute top-5 right-5 text-zinc-400 hover:text-zinc-700 transition-colors text-xl"
        @click="isOpen = false"
      >
        ✕
      </button>

      <h2 class="text-3xl font-medium text-brand-teal-500 text-center mb-8">
        Join Our Team
      </h2>

      <form
        class="space-y-5"
        @submit.prevent
      >
        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            class="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500 placeholder:text-zinc-400"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Email Address</label>
          <input
            type="email"
            placeholder="JohnDoe@gmail.com"
            class="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500 placeholder:text-zinc-400"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Phone Number</label>
          <div class="flex items-center rounded-xl border border-zinc-200 overflow-hidden focus-within:ring-2 focus-within:ring-brand-teal-500">
            <div class="px-3 py-3 border-r border-zinc-200 flex items-center gap-1.5 bg-zinc-50">
              <span>🇮🇳</span>
              <svg
                class="w-3 h-3 text-zinc-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
            <input
              type="tel"
              placeholder="+91 12345 67890"
              class="flex-1 px-3 py-3 text-sm focus:outline-none placeholder:text-zinc-400 bg-transparent"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Upload CV/Resume</label>
          <label class="inline-flex items-center justify-center px-6 py-2.5 border border-zinc-300 rounded-xl text-sm font-medium text-brand-dark cursor-pointer hover:bg-zinc-50 transition-colors">
            Browse
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              class="hidden"
            >
          </label>
        </div>

        <button
          type="submit"
          class="w-full py-4 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full flex items-center justify-center gap-2 hover:bg-brand-yellow-400 transition-colors mt-2"
        >
          Enquire Now ↗
        </button>
      </form>
    </div>
  </div>
</template>
