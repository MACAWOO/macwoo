<script setup lang="ts">
const route = useRoute()
const isCareers = computed(() => route.path === '/careers')
const isYellowFooter = computed(() => isCareers.value || route.path === '/portfolio' || route.path === '/case-studies')
</script>

<template>
  <footer :class="[isYellowFooter ? 'bg-[#1D96B8]' : 'bg-white', 'px-4 md:px-10 py-16 md:py-24']">
    <div
      class="max-w-[1400px] mx-auto rounded-[2.5rem] px-8 pt-16 pb-8 md:px-16 md:pt-20 md:pb-12 transition-colors duration-300"
      :class="isYellowFooter ? 'bg-brand-yellow-500 text-brand-dark' : 'bg-[#1D96B8] text-white'"
    >
      <div class="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
        <!-- Navigation -->
        <div>
          <h4 class="font-bold text-base md:text-lg mb-5" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
            Navigation
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Home</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/about"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >About</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/portfolio"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Portfolio</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/case-studies"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Case Studies</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/blog"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Blog</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/careers"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Careers</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Services -->
        <div>
          <h4 class="font-bold text-base md:text-lg mb-5" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
            Services
          </h4>
          <ul class="space-y-3">
            <li>
              <NuxtLink
                to="/services/branding-design"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Branding & Designing</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/services/digital-marketing"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Digital Marketing</NuxtLink>
            </li>
            <li>
              <NuxtLink
                to="/services/video-production"
                class="text-sm md:text-base hover:opacity-80 transition-opacity"
                :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
              >Video Production</NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Contact -->
        <div>
          <h4 class="font-bold text-base md:text-lg mb-5" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
            Contact
          </h4>
          <ul class="space-y-3">
            <li :class="isYellowFooter ? 'text-brand-dark' : 'text-white'" class="text-sm md:text-base">
              Phone Number:
            </li>
            <li :class="isYellowFooter ? 'text-brand-dark' : 'text-white'" class="text-sm md:text-base font-semibold">
              +91 9747477502
            </li>
            <li :class="isYellowFooter ? 'text-brand-dark' : 'text-white'" class="text-sm md:text-base pt-2">
              Email Id:
            </li>
            <li :class="isYellowFooter ? 'text-brand-dark' : 'text-white'" class="text-sm md:text-base break-all">
              macawooofficial@gmail.com
            </li>
          </ul>
        </div>

        <!-- Address + Social -->
        <div>
          <div class="flex items-center justify-between gap-4 mb-5">
            <h4 class="font-bold text-base md:text-lg" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
              Address
            </h4>
            <div class="flex items-center gap-3" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
              <a
                href="#"
                aria-label="Facebook"
                class="hover:opacity-80 transition-opacity"
              >
                <svg
                  class="w-5.5 h-5.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                class="hover:opacity-80 transition-opacity"
              >
                <svg
                  class="w-5.5 h-5.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                class="hover:opacity-80 transition-opacity"
              >
                <svg
                  class="w-5.5 h-5.5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>
          <p class="text-sm md:text-base" :class="isYellowFooter ? 'text-brand-dark' : 'text-white'">
            Kerala | UAE
          </p>
        </div>
      </div>

      <!-- Bottom strip -->
      <div
        class="border-t pt-6 mt-12 flex flex-col sm:flex-row items-start sm:items-center gap-y-2 gap-x-8 text-xs md:text-sm"
        :class="isYellowFooter ? 'border-brand-dark/20 text-brand-dark' : 'border-white/20 text-white'"
      >
        <p>
          All right Reserved @ <NuxtLink
            to="/admin"
            class="hover:underline transition-all"
            :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
          >Macawoo</NuxtLink>
        </p>
        <div class="flex items-center gap-2">
          <a
            href="#"
            class="hover:underline"
            :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
          >Privacy</a>
          <span :class="isYellowFooter ? 'text-brand-dark/50' : 'text-white/50'">|</span>
          <a
            href="#"
            class="hover:underline"
            :class="isYellowFooter ? 'text-brand-dark' : 'text-white'"
          >Terms & Conditions</a>
        </div>
      </div>
    </div>
  </footer>
</template>
