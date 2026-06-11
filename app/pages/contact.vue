<script setup lang="ts">
const { settings } = usePageSettings()

useSeoMeta({
  title: 'Contact — Macawoo',
  description: 'Ready to elevate your brand? Drop us a line and let\'s start crafting a narrative that commands attention and drives results.'
})

const services = ['Branding & Design', 'Digital Marketing', 'Video Production', 'Others']
const form = reactive({ name: '', service: '', email: '', phone: '', message: '' })
</script>

<template>
  <div>
    <PageHero
      title-html="Let's Build Something<br><em class='not-italic text-brand-yellow-500'>Powerful.</em>"
      :video="settings.contactHeroVideo"
      :image="settings.contactHeroImage"
      description="Ready to elevate your brand? Drop us a line and let's start crafting a narrative that commands attention and drives results."
    />

    <!-- Form + Direct Lines -->
    <section class="py-20 bg-brand-yellow-500">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col lg:flex-row gap-10">
          <!-- Form -->
          <div class="flex-1">
            <form
              class="space-y-5"
              @submit.prevent
            >
              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-brand-dark mb-1.5">Full Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    placeholder="John Doe"
                    class="w-full px-4 py-3 rounded-xl border border-brand-dark/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark placeholder:text-zinc-400"
                  >
                </div>
                <div>
                  <label class="block text-xs font-semibold text-brand-dark mb-1.5">Select Service's</label>
                  <select
                    v-model="form.service"
                    class="w-full px-4 py-3 rounded-xl border border-brand-dark/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark text-zinc-600 appearance-none"
                  >
                    <option
                      value=""
                      disabled
                    >
                      Select Services
                    </option>
                    <option
                      v-for="s in services"
                      :key="s"
                      :value="s"
                    >
                      {{ s }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="grid sm:grid-cols-2 gap-5">
                <div>
                  <label class="block text-xs font-semibold text-brand-dark mb-1.5">Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    placeholder="john@gmail.com"
                    class="w-full px-4 py-3 rounded-xl border border-brand-dark/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark placeholder:text-zinc-400"
                  >
                </div>
                <div>
                  <label class="block text-xs font-semibold text-brand-dark mb-1.5">Phone Number</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    placeholder="+91 00000 00000"
                    class="w-full px-4 py-3 rounded-xl border border-brand-dark/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark placeholder:text-zinc-400"
                  >
                </div>
              </div>

              <div>
                <label class="block text-xs font-semibold text-brand-dark mb-1.5">Message</label>
                <textarea
                  v-model="form.message"
                  rows="4"
                  placeholder="Tell us about your project, goals, and any specific requirements. We'll get back to you shortly."
                  class="w-full px-4 py-3 rounded-xl border border-brand-dark/20 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-dark placeholder:text-zinc-400 resize-none"
                />
              </div>

              <button
                type="submit"
                class="px-8 py-3.5 bg-brand-dark text-white text-sm font-bold rounded-full hover:bg-brand-dark/80 transition-colors flex items-center gap-2"
              >
                Get Started ×
              </button>
            </form>
          </div>

          <!-- Direct Lines -->
          <div class="lg:w-72 shrink-0">
            <div class="bg-white rounded-2xl p-8 h-full">
              <h3 class="font-bold text-brand-dark text-lg mb-6">
                Direct Lines
              </h3>
              <div class="space-y-6">
                <div class="flex gap-4 items-start">
                  <div class="w-8 h-8 bg-brand-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      class="w-4 h-4 text-brand-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-zinc-500 mb-1">
                      Email Us
                    </p>
                    <a
                      href="mailto:macawooofficial@gmail.com"
                      class="text-brand-dark text-sm font-medium hover:text-brand-teal-500 transition-colors break-all"
                    >
                      macawooofficial@gmail.com
                    </a>
                  </div>
                </div>

                <div class="flex gap-4 items-start">
                  <div class="w-8 h-8 bg-brand-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      class="w-4 h-4 text-brand-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-zinc-500 mb-1">
                      Call Us
                    </p>
                    <a
                      href="tel:+919847043210"
                      class="text-brand-dark text-sm font-medium hover:text-brand-teal-500 transition-colors"
                    >
                      +91 98760 43210
                    </a>
                  </div>
                </div>

                <div class="flex gap-4 items-start">
                  <div class="w-8 h-8 bg-brand-teal-50 rounded-lg flex items-center justify-center shrink-0">
                    <svg
                      class="w-4 h-4 text-brand-teal-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p class="text-xs font-semibold text-zinc-500 mb-1">
                      Location
                    </p>
                    <p class="text-brand-dark text-sm font-medium">
                      Kerala | UAE
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
