<script setup lang="ts">
import { ref } from 'vue'

const isOpen = defineModel<boolean>({ default: false })

const name = ref('')
const email = ref('')
const phone = ref('')
const resumeBase64 = ref('')
const resumeName = ref('')

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMsg = ref('')

const fileInputRef = ref<HTMLInputElement | null>(null)
const turnstileRef = ref<any>(null)
const turnstileToken = ref('')

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file) return

  // Validate file size limit (5MB)
  if (file.size > 5 * 1024 * 1024) {
    errorMsg.value = 'Resume file size must be less than 5MB.'
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    return
  }

  resumeName.value = file.name
  errorMsg.value = ''

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    // Extract base64 content
    const base64Data = result.split(',')[1]
    resumeBase64.value = base64Data
  }
  reader.readAsDataURL(file)
}

const clearFile = () => {
  resumeName.value = ''
  resumeBase64.value = ''
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const handleVerify = (token: string) => {
  turnstileToken.value = token
  errorMsg.value = ''
}

const handleExpire = () => {
  turnstileToken.value = ''
}

const handleSubmit = async () => {
  if (!name.value || !email.value) {
    errorMsg.value = 'Name and Email are required fields.'
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = 'Please complete the security verification.'
    return
  }

  isSubmitting.value = true
  errorMsg.value = ''

  try {
    await $fetch('/api/careers', {
      method: 'POST',
      body: {
        name: name.value,
        email: email.value,
        phone: phone.value || null,
        resume: resumeBase64.value || null,
        resumeName: resumeName.value || null,
        token: turnstileToken.value
      }
    })

    isSubmitted.value = true

    // Reset fields
    name.value = ''
    email.value = ''
    phone.value = ''
    clearFile()

    if (turnstileRef.value) {
      turnstileRef.value.reset()
    }
    turnstileToken.value = ''

    // Close the modal after showing success message
    setTimeout(() => {
      isSubmitted.value = false
      isOpen.value = false
    }, 4000)
  } catch (err: any) {
    console.error('Failed to submit application:', err)
    errorMsg.value = err.data?.statusMessage || 'Failed to submit application. Please try again.'
    if (turnstileRef.value) {
      turnstileRef.value.reset()
    }
    turnstileToken.value = ''
  } finally {
    isSubmitting.value = false
  }
}
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

      <!-- Success Screen -->
      <div
        v-if="isSubmitted"
        class="flex flex-col items-center justify-center text-center p-8 min-h-[350px] text-brand-dark animate-fade-in"
      >
        <div class="w-16 h-16 bg-brand-teal-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg animate-bounce">
          <svg
            class="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="3"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h3 class="text-2xl font-bold mb-2 text-brand-teal-500 uppercase tracking-wide">
          Application Sent!
        </h3>
        <p class="text-zinc-600 max-w-xs font-semibold leading-relaxed">
          Thank you for applying. We have received your details and resume, and we will get back to you shortly.
        </p>
      </div>

      <form
        v-else
        class="space-y-5"
        @submit.prevent="handleSubmit"
      >
        <div
          v-if="errorMsg"
          class="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-sm font-semibold leading-relaxed"
        >
          {{ errorMsg }}
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Full Name</label>
          <input
            v-model="name"
            type="text"
            required
            placeholder="John Doe"
            class="w-full px-4 py-3 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-teal-500 placeholder:text-zinc-400"
          >
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Email Address</label>
          <input
            v-model="email"
            type="email"
            required
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
              v-model="phone"
              type="tel"
              placeholder="+91 12345 67890"
              class="flex-1 px-3 py-3 text-sm focus:outline-none placeholder:text-zinc-400 bg-transparent"
            >
          </div>
        </div>

        <div>
          <label class="block text-sm font-semibold text-brand-dark mb-1.5">Upload CV/Resume</label>
          <div class="flex items-center gap-3">
            <label class="inline-flex items-center justify-center px-6 py-2.5 border border-zinc-300 rounded-xl text-sm font-medium text-brand-dark cursor-pointer hover:bg-zinc-50 transition-colors">
              Browse
              <input
                ref="fileInputRef"
                type="file"
                accept=".pdf,.doc,.docx"
                class="hidden"
                @change="handleFileChange"
              >
            </label>
            <span
              v-if="resumeName"
              class="text-xs text-zinc-700 font-semibold flex items-center gap-1.5 bg-zinc-100 px-3 py-1.5 rounded-lg border border-zinc-200"
            >
              <svg
                class="w-4 h-4 text-brand-teal-500 shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  clip-rule="evenodd"
                />
              </svg>
              <span class="max-w-[150px] truncate">{{ resumeName }}</span>
              <button
                type="button"
                class="text-zinc-400 hover:text-rose-500 transition-colors text-xs font-bold pl-1 cursor-pointer"
                @click="clearFile"
              >
                ✕
              </button>
            </span>
            <span
              v-else
              class="text-xs text-zinc-400 font-medium"
            >
              PDF, DOC, DOCX up to 5MB
            </span>
          </div>
        </div>

        <!-- Cloudflare Turnstile -->
        <Turnstile
          ref="turnstileRef"
          @verify="handleVerify"
          @expire="handleExpire"
          @error="handleExpire"
        />

        <button
          type="submit"
          :disabled="isSubmitting"
          class="w-full py-4 bg-brand-yellow-500 text-brand-dark text-sm font-bold rounded-full flex items-center justify-center gap-2 hover:bg-brand-yellow-400 transition-colors mt-2 disabled:opacity-75 disabled:pointer-events-none cursor-pointer"
        >
          <span v-if="isSubmitting">Submitting...</span>
          <span v-else>Enquire Now ↗</span>
        </button>
      </form>
    </div>
  </div>
</template>
