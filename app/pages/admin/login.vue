<script setup lang="ts">
definePageMeta({
  // Login page must NOT require auth; middleware self-skips this path,
  // but keep it explicit so the layout/SSR behaviour matches the admin area.
  layout: false
})

useSeoMeta({
  title: 'Sign in — Macawoo Administration',
  robots: 'noindex, nofollow'
})

const { signIn, init } = useAuth()

const email = ref('')
const password = ref('')
const errorMessage = ref<string | null>(null)
const isSubmittingForm = ref(false)
const showPassword = ref(false)

onMounted(async () => {
  // If already signed in, skip straight to the dashboard.
  await init()
  const { isAuthenticated } = useAuth()
  if (isAuthenticated.value) {
    navigateTo('/admin')
  }
})

const handleSubmit = async () => {
  errorMessage.value = null
  isSubmittingForm.value = true
  try {
    await signIn(email.value.trim(), password.value)
    navigateTo('/admin')
  } catch {
    // Generic message — never surface raw backend errors.
    errorMessage.value = 'Invalid email or password.'
  } finally {
    isSubmittingForm.value = false
  }
}
</script>

<template>
  <div class="relative min-h-screen flex items-center justify-center px-4 py-10 font-sans antialiased bg-[#1D96B8]">
    <div class="relative w-full max-w-sm z-10">
      <!-- Logo lockup (speech-bubble + blue inner circle motif) -->
      <div class="flex flex-col items-center mb-8 select-none">
        <div class="relative w-[88px] h-[88px] flex items-center justify-center mb-5 group/logo">
          <svg
            class="absolute inset-0 w-full h-full drop-shadow-[0px_8px_20px_rgba(0,0,0,0.15)] transition-transform duration-500 ease-out group-hover/logo:rotate-12 group-hover/logo:scale-105"
            viewBox="0 0 100 100"
            fill="none"
          >
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="#EDE000"
            />
            <polygon
              points="65,82 82,65 88,88"
              fill="#EDE000"
            />
          </svg>
          <div class="w-[34px] h-[34px] bg-[#1D96B8] rounded-full absolute z-0 transition-transform duration-500 group-hover/logo:scale-95" />
          <img
            src="/Images/Logo.png"
            alt="Macawoo"
            class="w-14 h-14 object-contain select-none pointer-events-none z-10 transition-transform duration-500 group-hover/logo:scale-110"
          >
        </div>
        <h1 class="text-3xl font-fredoka font-semibold tracking-wide text-white">
          MACAWOO <span class="text-brand-yellow-500">ADMIN</span>
        </h1>
        <p class="text-xs text-white/80 mt-2 font-sans tracking-wide">
          Sign in to manage site content.
        </p>
      </div>

      <!-- Yellow Login Card -->
      <form
        class="relative rounded-[24px] p-8 space-y-6 bg-[#EDE000] border border-[#e2d500] shadow-[0_24px_50px_-12px_rgba(0,0,0,0.25)]"
        @submit.prevent="handleSubmit"
      >
        <transition
          enter-active-class="transition duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
        >
          <div
            v-if="errorMessage"
            class="relative z-10 flex items-center gap-2 bg-red-500/10 border border-red-500/30 px-4 py-3 rounded-xl text-xs text-red-800 shadow-[0_4px_12px_rgba(239,68,68,0.1)]"
          >
            <svg
              class="w-4 h-4 shrink-0 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            </svg>
            <span class="font-sans leading-relaxed">{{ errorMessage }}</span>
          </div>
        </transition>

        <!-- Email field -->
        <div class="space-y-2">
          <label class="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider font-sans">
            Email
          </label>
          <div class="relative group/input">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 transition-colors duration-300 group-focus-within/input:text-[#1D96B8]">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </span>
            <input
              v-model="email"
              type="email"
              required
              autocomplete="username"
              placeholder="you@macawoo.com"
              class="w-full pl-11 pr-4 py-3 rounded-xl text-sm text-zinc-900 bg-white border border-zinc-200/80 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D96B8] focus:ring-2 focus:ring-[#1D96B8]/20 transition-all duration-300 shadow-sm"
            >
          </div>
        </div>

        <!-- Password field -->
        <div class="space-y-2">
          <label class="block text-[11px] font-bold text-brand-dark/80 uppercase tracking-wider font-sans">
            Password
          </label>
          <div class="relative group/input">
            <span class="absolute inset-y-0 left-0 flex items-center pl-3.5 text-zinc-400 transition-colors duration-300 group-focus-within/input:text-[#1D96B8]">
              <svg
                class="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </span>
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              placeholder="••••••••"
              class="w-full pl-11 pr-11 py-3 rounded-xl text-sm text-zinc-900 bg-white border border-zinc-200/80 placeholder:text-zinc-400 focus:outline-none focus:border-[#1D96B8] focus:ring-2 focus:ring-[#1D96B8]/20 transition-all duration-300 shadow-sm"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3.5 text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              @click="showPassword = !showPassword"
            >
              <svg
                v-if="showPassword"
                class="w-4.5 h-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L3 3m6.88 6.88L21 21"
                />
              </svg>
              <svg
                v-else
                class="w-4.5 h-4.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Submit Button (Teal Accent) -->
        <button
          type="submit"
          :disabled="isSubmittingForm"
          class="group relative w-full py-3 rounded-xl bg-[#1D96B8] hover:bg-[#157d9b] disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-bold shadow-[0_4px_14px_rgba(29,150,184,0.35)] hover:shadow-[0_4px_18px_rgba(29,150,184,0.5)] cursor-pointer transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 border border-[#1D96B8]/10"
        >
          <svg
            v-if="isSubmittingForm"
            class="w-4 h-4 animate-spin text-white"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              class="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              stroke-width="4"
            />
            <path
              class="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <span class="font-sans tracking-wide">{{ isSubmittingForm ? 'Signing in…' : 'Sign in' }}</span>
        </button>
      </form>

      <!-- Footer security note -->
      <p class="flex items-center justify-center gap-1.5 text-center text-[10px] text-white/60 mt-8 relative z-10 select-none">
        <svg
          class="w-3.5 h-3.5 text-white/40"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        Authorized personnel only. Access is logged.
      </p>
    </div>
  </div>
</template>
