<script setup lang="ts">
// import { projects } from '~/data/portfolio'

useSeoMeta({
  title: 'Macawoo — Feel The Woo',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
})

const containerRef = ref<HTMLElement | null>(null)
const textRevealRef = ref<HTMLElement | null>(null)

// Scroll-bound About Us section animation variables
const aboutTrackRef = ref<HTMLElement | null>(null)
const logoPlaceholderRef = ref<HTMLElement | null>(null)
const trackProgress = ref(0)
const logoOffset = ref({ x: 0, y: 0 })

const updateLogoOffset = () => {
  if (!logoPlaceholderRef.value) return
  let el = logoPlaceholderRef.value
  let left = 0
  let top = 0
  while (el && !el.classList.contains('sticky')) {
    left += el.offsetLeft
    top += el.offsetTop
    el = el.offsetParent as HTMLElement
  }

  const placeholderCenterX = left + logoPlaceholderRef.value.offsetWidth / 2
  const placeholderCenterY = top + logoPlaceholderRef.value.offsetHeight / 2

  const stickyContainer = logoPlaceholderRef.value.closest('.sticky') as HTMLElement
  const stickyWidth = stickyContainer ? stickyContainer.offsetWidth : window.innerWidth
  const stickyHeight = stickyContainer ? stickyContainer.offsetHeight : window.innerHeight

  logoOffset.value = {
    x: (stickyWidth / 2) - placeholderCenterX,
    y: (stickyHeight / 2) - placeholderCenterY
  }
}

const backgroundStyle = computed(() => {
  const t = Math.max(0, Math.min(1, trackProgress.value / 0.15))
  return {
    opacity: t,
    transform: `scale(${0.95 + t * 0.05})`
  }
})

const logoStyle = computed(() => {
  const t = Math.max(0, Math.min(1, trackProgress.value / 0.4))
  // Cubic ease-in-out
  const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2

  const scale = 2.5 - 1.5 * eased
  const x = logoOffset.value.x * (1 - eased)
  const y = logoOffset.value.y * (1 - eased)

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: 'center center'
  }
})

const taglineOpacity = computed(() => {
  if (trackProgress.value < 0.4) return 0
  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.4) / 0.2))
  return t
})

const textColumnOpacity = computed(() => {
  if (trackProgress.value < 0.3) return 0
  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.3) / 0.2))
  return t
})

const revealText = 'At Macawoo, we create brands that connect, campaigns that perform, and stories that leave a lasting impression. Through branding, marketing, and storytelling, we help businesses stand out, stay relevant, and grow with purpose.'
const words = revealText.split(' ')

const services = ['Branding & Design', 'Digital Marketing', 'Video Production', 'Others']
const form = reactive({ name: '', service: '', email: '', phone: '', message: '' })

const isSubmitting = ref(false)
const isSubmitted = ref(false)

const getWordStyle = (index: number) => {
  const totalWords = words.length
  // Words start revealing after progress = 0.45
  const start = (index / totalWords) * 0.75
  const end = start + 0.25

  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.45) / 0.55))

  let opacity = 0.25
  if (t >= end) {
    opacity = 1.0
  } else if (t <= start) {
    opacity = 0.25
  } else {
    const factor = (t - start) / (end - start)
    opacity = 0.25 + factor * 0.75
  }

  return {
    opacity,
    transition: 'opacity 0.15s ease-out'
  }
}

const handleScroll = () => {
  if (!aboutTrackRef.value) return
  const rect = aboutTrackRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  const totalDistance = rect.height - windowHeight
  const scrolledDistance = -rect.top

  const progress = Math.max(0, Math.min(1, scrolledDistance / totalDistance))
  trackProgress.value = progress
}

const handleSubmit = async () => {
  isSubmitting.value = true
  // Simulate API submission
  await new Promise(resolve => setTimeout(resolve, 1200))
  isSubmitting.value = false
  isSubmitted.value = true

  // Reset form
  form.name = ''
  form.service = ''
  form.email = ''
  form.phone = ''
  form.message = ''

  // Clear success message after 5 seconds
  setTimeout(() => {
    isSubmitted.value = false
  }, 5000)
}

onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  })

  if (containerRef.value) {
    const cards = containerRef.value.querySelectorAll('.reveal-card')
    cards.forEach(card => observer.observe(card))
  }

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('resize', updateLogoOffset)
  handleScroll()

  nextTick(() => {
    updateLogoOffset()
  })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', updateLogoOffset)
})
</script>

<template>
  <div>
    <!-- Hero -->
    <PageHero
      title-html="FEEL THE <span class=&quot;text-brand-yellow-500&quot;>WOO</span>"
      image="/Images/hero.png"
      description="From strategy to storytelling, we create brands, campaigns, and content that don't just look good but perform, connect, and grow."
    />

    <!-- About Section Track (300vh height to give space for scrolling animation) -->
    <section
      ref="aboutTrackRef"
      class="relative h-[300vh] bg-transparent"
    >
      <!-- Pinned Viewport Container (Sticky h-screen) -->
      <div class="sticky top-0 h-screen w-full overflow-hidden bg-brand-dark flex items-center">
        <!-- Sliding Background Overlay -->
        <div
          class="absolute inset-0 bg-[#1D96B8] transition-transform duration-75"
          :style="backgroundStyle"
        />

        <div class="relative z-10 max-w-[1266px] w-full mx-auto px-6 md:px-8">
          <div class="flex flex-col md:flex-row gap-12 md:gap-20 items-center md:items-start relative">
            <!-- Left column -->
            <div class="md:w-[340px] shrink-0 flex flex-col gap-6">
              <!-- ABOUT US label -->
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full bg-[#E8F600] inline-block shrink-0" />
                <span
                  class="text-[#E8F600] text-xs font-semibold uppercase tracking-[0.18em]"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >About Us</span>
              </div>

              <!-- Logo container (This will be animated from center to left) -->
              <div
                ref="logoPlaceholderRef"
                class="relative h-[140px] w-[140px] shrink-0"
              >
                <img
                  src="/Images/Logo.png"
                  alt="Macawoo logo"
                  class="absolute w-[140px] h-[140px] object-contain"
                  :style="logoStyle"
                >
              </div>

              <!-- Tagline below logo (fades in after logo finishes moving) -->
              <p
                class="text-[#E8F600] text-sm leading-relaxed max-w-[260px] transition-opacity duration-300"
                :style="{ opacity: taglineOpacity }"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                We love to create, we love to solve, we love to collaborate, and we love to turn amazing ideas into reality. We're here to partner with you through every step of the process.
              </p>
            </div>

            <!-- Right column – statement copy -->
            <div
              ref="textRevealRef"
              class="flex-1 flex items-center md:pt-8"
              :style="{ opacity: textColumnOpacity }"
            >
              <p
                class="text-white text-[28px] md:text-[36px] lg:text-[42px] font-semibold leading-[1.25]"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span
                  v-for="(word, index) in words"
                  :key="index"
                  class="inline-block mr-[0.23em]"
                  :style="getWordStyle(index)"
                >
                  {{ word }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- What We Do -->
    <section class="py-16 md:py-20 bg-white">
      <div class="max-w-[1201px] mx-auto px-6 md:px-0">
        <!-- Title — Fredoka 48px / 500 weight per Figma -->
        <h2
          class="text-center text-[#1D96B8] text-[36px] md:text-[48px] leading-[58px] font-medium mb-[63px]"
          style="font-family: 'Fredoka', sans-serif;"
        >
          What We Do
        </h2>

        <!-- Cards — equal width, fixed 492px height, ~13px gap -->
        <div
          ref="containerRef"
          class="grid grid-cols-1 md:grid-cols-3 gap-[13px]"
        >
          <!-- Branding & Design -->
          <NuxtLink
            to="/services/branding-design"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 0ms;"
          >
            <img
              src="/Images/Branding.jpeg"
              alt="Branding & Design"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <!-- gradient starts at 39.84% from top -->
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            />
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            />
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Branding</span><br>&amp; Design
              </p>
            </div>
          </NuxtLink>

          <!-- Digital Marketing -->
          <NuxtLink
            to="/services/digital-marketing"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 150ms;"
          >
            <img
              src="/Images/Digital Marketing.jpeg"
              alt="Digital Marketing"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            />
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            />
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Digital</span><br>Marketing
              </p>
            </div>
          </NuxtLink>

          <!-- Video Production -->
          <NuxtLink
            to="/services/video-production"
            class="relative rounded-[10px] overflow-hidden group block h-[320px] md:h-[492px] reveal-card"
            style="transition-delay: 300ms;"
          >
            <img
              src="/Images/Video Production.jpeg"
              alt="Video Production"
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            >
            <div
              class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
              style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
            />
            <!-- Hover overlay -->
            <div
              class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
            />
            <!-- label centered bottom by default, moves to center on hover -->
            <div class="absolute inset-0 flex items-center justify-center">
              <p
                class="text-white text-[24px] md:text-[32px] font-normal leading-[38px] text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[153px] group-hover:translate-y-0"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                <span class="font-bold">Video</span><br>Production
              </p>
            </div>
          </NuxtLink>
        </div>

        <!-- Client Logos -->
        <div class="mt-16 md:mt-24">
          <ClientLogos />
        </div>
      </div>
    </section>

    <!-- Featured Work -->
    <FeaturedWork />

    <!-- Our Approach -->
    <section class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row gap-12 items-start">
          <div class="md:w-1/3">
            <p class="text-brand-yellow-500 text-xs font-semibold uppercase tracking-widest mb-3">
              Our Approach
            </p>
            <h2 class="text-3xl md:text-4xl font-bold text-brand-dark">
              How we turn ideas into impact
            </h2>
          </div>
          <div class="md:w-2/3 grid sm:grid-cols-2 gap-8">
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                01
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Think
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We start with deep discovery — understanding your brand, your audience, and your goals before any creative work begins.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                02
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Focus
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We define the strategy — narrowing in on what will genuinely move the needle and align with your business objectives.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                03
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Create
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We build — crafting every visual, word, and interaction with intentionality and craft that reflects your brand at its best.
                </p>
              </div>
            </div>
            <div class="flex gap-4">
              <div class="w-10 h-10 shrink-0 bg-brand-yellow-500 rounded-full flex items-center justify-center text-brand-dark font-bold text-sm">
                04
              </div>
              <div>
                <h3 class="font-bold text-brand-dark mb-2">
                  Deliver
                </h3>
                <p class="text-zinc-600 text-sm leading-relaxed">
                  We launch, measure, and optimise — ensuring the work performs in the real world, not just in a presentation deck.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Macawoo -->
    <WhyMacawoo />

    <!-- CTA (Get Started Form & Card ) -->
    <section class="py-20 md:py-28 bg-[#1D96B8] relative overflow-hidden">
      <div class="max-w-[1266px] mx-auto px-6 md:px-8">
        <div class="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
          <!-- Left side: Design card -->
          <div class="flex-1 rounded-[32px] overflow-hidden relative min-h-[350px] lg:min-h-[500px] flex flex-col justify-end p-8 md:p-12 shadow-xl group">
            <!-- Background Image -->
            <div class="absolute inset-0 bg-[url('/Images/wavy_yellow_teal_bg.png')] bg-cover bg-center transition-transform duration-700 group-hover:scale-105" />
            <!-- Gradient Overlay for readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            <!-- Text Content -->
            <div class="relative z-10">
              <h2
                class="text-white text-3xl md:text-4xl lg:text-[42px] font-bold leading-[1.2] tracking-tight"
                style="font-family: 'Bricolage Grotesque', sans-serif;"
              >
                Convert your ideas into<br>successful business
              </h2>
            </div>
          </div>

          <!-- Right side: Form -->
          <div class="flex-1 flex flex-col justify-center">
            <div
              v-if="isSubmitted"
              class="flex flex-col items-center justify-center text-center p-8 bg-[#1684A2]/50 rounded-[32px] border border-white/10 h-full min-h-[400px]"
            >
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-[#1D96B8] mb-4 shadow-lg animate-bounce">
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
              <h3 class="text-2xl font-bold text-white mb-2">
                Message Sent!
              </h3>
              <p class="text-white/80 max-w-sm">
                Thank you for reaching out. The Macawoo team will get back to you shortly.
              </p>
            </div>

            <form
              v-else
              class="space-y-6"
              @submit.prevent="handleSubmit"
            >
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Full Name -->
                <div>
                  <label
                    class="block text-sm font-semibold text-brand-dark mb-2"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >Full Name</label>
                  <input
                    v-model="form.name"
                    type="text"
                    required
                    placeholder="John Doe"
                    class="w-full px-5 py-4 rounded-xl border border-brand-dark/30 bg-[#1684A2]/60 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-base transition-colors"
                  >
                </div>

                <!-- Select Service's -->
                <div>
                  <label
                    class="block text-sm font-semibold text-brand-dark mb-2"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >Select Service's</label>
                  <div class="relative">
                    <select
                      v-model="form.service"
                      required
                      class="w-full px-5 py-4 rounded-xl border border-brand-dark/30 bg-[#1684A2]/60 text-white focus:outline-none focus:ring-2 focus:ring-white/50 text-base appearance-none cursor-pointer transition-colors"
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
                        class="text-brand-dark bg-white"
                      >
                        {{ s }}
                      </option>
                    </select>
                    <!-- Custom Dropdown Icon -->
                    <div class="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none w-7 h-7 rounded-full border border-brand-dark/30 flex items-center justify-center bg-transparent">
                      <svg
                        class="w-4 h-4 text-brand-dark"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2.5"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Email -->
                <div>
                  <label
                    class="block text-sm font-semibold text-brand-dark mb-2"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >Email</label>
                  <input
                    v-model="form.email"
                    type="email"
                    required
                    placeholder="john@gmail.com"
                    class="w-full px-5 py-4 rounded-xl border border-brand-dark/30 bg-[#1684A2]/60 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-base transition-colors"
                  >
                </div>

                <!-- Phone Number -->
                <div>
                  <label
                    class="block text-sm font-semibold text-brand-dark mb-2"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >Phone Number</label>
                  <input
                    v-model="form.phone"
                    type="tel"
                    required
                    placeholder="+91 00000 00000"
                    class="w-full px-5 py-4 rounded-xl border border-brand-dark/30 bg-[#1684A2]/60 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-base transition-colors"
                  >
                </div>
              </div>

              <!-- Message -->
              <div>
                <label
                  class="block text-sm font-semibold text-brand-dark mb-2"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >Message</label>
                <textarea
                  v-model="form.message"
                  required
                  rows="4"
                  placeholder="Tell us about your project, goals, and any specific requirements. We'll get back to you shortly."
                  class="w-full px-5 py-4 rounded-xl border border-brand-dark/30 bg-[#1684A2]/60 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-base transition-colors resize-none"
                />
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  :disabled="isSubmitting"
                  class="group inline-flex items-center gap-3 px-8 py-4 bg-white text-brand-dark font-bold rounded-full text-base hover:bg-zinc-100 transition-all duration-300 transform active:scale-95 disabled:opacity-75 disabled:pointer-events-none shadow-md cursor-pointer"
                >
                  <span v-if="isSubmitting">Submitting...</span>
                  <span v-else>Get Started</span>
                  <UpRightArrow
                    v-if="!isSubmitting"
                    class="w-3 h-3 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
