<script setup lang="ts">
// import { projects } from '~/data/portfolio'

useSeoMeta({
  title: 'Macawoo — Feel The Woo',
  description: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.',
  ogTitle: 'Macawoo — Feel The Woo',
  ogDescription: 'We are a creative & strategy agency. We blend raw creative energy with executive-level precision to craft brands that command attention and drive growth.'
})

const { settings } = usePageSettings()

const containerRef = ref<HTMLElement | null>(null)
const textRevealRef = ref<HTMLElement | null>(null)

const isMobile = ref(false)
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768
}

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

const disperseScale = computed(() => {
  if (isMobile.value) return 0
  const t = Math.max(0, Math.min(1, trackProgress.value / 0.22))
  // Progressive scale of dispersion distortion
  return t * t * 250
})

const heroOpacity = computed(() => {
  if (isMobile.value) return 1
  // Pinned PageHero wrapper container is active until the background image completely fades out at 0.50
  if (trackProgress.value <= 0.25) return 1
  if (trackProgress.value >= 0.50) return 0
  return 1 - ((trackProgress.value - 0.25) / 0.25)
})

const heroBgStyle = computed(() => {
  if (isMobile.value) return { opacity: 0.6 }
  // Keep background image fully visible (at !opacity-60, which is 0.6) until progress reaches 0.25.
  // Fades out between 0.25 and 0.50.
  if (trackProgress.value <= 0.25) return { opacity: 0.6 }
  if (trackProgress.value >= 0.50) return { opacity: 0 }
  const t = (trackProgress.value - 0.25) / 0.25
  return {
    opacity: 0.6 * (1 - t)
  }
})

const heroContentStyle = computed(() => {
  if (isMobile.value) return { opacity: 1, filter: 'none', transform: 'none', pointerEvents: 'auto' }
  // Hero text / content blurs out and disperses out between progress 0.0 and 0.22.
  const t = Math.max(0, Math.min(1, trackProgress.value / 0.22))
  const opacityVal = Math.max(0, 1 - t * 1.2) // Fully fades out slightly before 0.22
  const blurVal = t * 24
  const scaleVal = 1 + t * 0.15
  return {
    opacity: opacityVal,
    filter: `url(#hero-disperse) blur(${blurVal}px)`,
    transform: `scale(${scaleVal})`,
    pointerEvents: (opacityVal > 0 ? 'auto' : 'none') as 'auto' | 'none'
  }
})

const backgroundStyle = computed(() => {
  if (isMobile.value) return { opacity: 1 }
  // Teal background overlay arrives when logo starts moving to left (progress >= 0.25)
  if (trackProgress.value <= 0.25) return { opacity: 0 }
  if (trackProgress.value >= 0.50) return { opacity: 1 }
  const t = (trackProgress.value - 0.25) / 0.25
  return {
    opacity: t,
    transform: `scale(${0.95 + t * 0.05})`
  }
})

const logoOpacity = computed(() => {
  if (isMobile.value) return 1
  // Logo fades in between progress 0.0 and 0.20
  if (trackProgress.value <= 0.20) {
    return trackProgress.value / 0.20
  }
  return 1
})

const logoStyle = computed(() => {
  if (isMobile.value) {
    return {
      transform: 'none',
      opacity: 1
    }
  }
  let scale = 1
  let x = 0
  let y = 0
  const winHeight = typeof window !== 'undefined' ? window.innerHeight : 800

  if (trackProgress.value < 0.25) {
    // Phase 1: Logo enters from bottom center to center, scaling up from 0.5 to 2.5
    const t = Math.max(0, Math.min(1, trackProgress.value / 0.25))
    // Cubic ease-out curve for smooth entry
    const easeT = 1 - Math.pow(1 - t, 3)
    scale = 0.5 + 2.0 * easeT

    // Horizontally centered (logoOffset.value.x)
    x = logoOffset.value.x
    // Vertically moves from bottom of screen (logoOffset.value.y + winHeight / 2 + 100) to center (logoOffset.value.y)
    y = logoOffset.value.y + (winHeight / 2 + 100) * (1 - easeT)
  } else {
    // Phase 2: Translate from center to left placeholder between 0.25 and 0.60
    const t = Math.max(0, Math.min(1, (trackProgress.value - 0.25) / 0.35))
    // Cubic ease-in-out curve
    const eased = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
    scale = 2.5 - 1.5 * eased
    x = logoOffset.value.x * (1 - eased)
    y = logoOffset.value.y * (1 - eased)
  }

  return {
    transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`,
    transformOrigin: 'center center',
    opacity: logoOpacity.value
  }
})

const taglineOpacity = computed(() => {
  if (isMobile.value) return 1
  if (trackProgress.value < 0.40) return 0
  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.40) / 0.25))
  return t
})

const textColumnOpacity = computed(() => {
  if (isMobile.value) return 1
  if (trackProgress.value < 0.30) return 0
  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.30) / 0.30))
  return t
})

const aboutSectionStyle = computed<import('vue').StyleValue>(() => {
  if (isMobile.value) return {}
  // Interactive only once Phase 2 begins
  const isInteractive = trackProgress.value >= 0.25
  return {
    pointerEvents: isInteractive ? 'auto' : 'none',
    zIndex: 30
  }
})

const labelOpacity = computed(() => {
  if (isMobile.value) return 1
  if (trackProgress.value < 0.25) return 0
  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.25) / 0.25)) // Fades in between 0.25 and 0.50
  return t
})

const revealText = 'At Macawoo, we create brands that connect, campaigns that perform, and stories that leave a lasting impression. Through branding, marketing, and storytelling, we help businesses stand out, stay relevant, and grow with purpose.'
const words = revealText.split(' ')

const services = ['Branding & Design', 'Digital Marketing', 'Video Production', 'Others']
const form = reactive({ name: '', service: '', email: '', phone: '', message: '' })

const isSubmitting = ref(false)
const isSubmitted = ref(false)
const errorMsg = ref('')

const getWordStyle = (index: number) => {
  if (isMobile.value) {
    return {
      opacity: 1,
      transition: 'none'
    }
  }
  const totalWords = words.length
  const start = (index / totalWords) * 0.35
  const end = start + 0.1

  const t = Math.max(0, Math.min(1, (trackProgress.value - 0.55) / 0.45))

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

const approachTrackRef = ref<HTMLElement | null>(null)
const approachProgress = ref(0)

const handleApproachScroll = () => {
  if (!approachTrackRef.value) return
  const rect = approachTrackRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  const totalDistance = rect.height - windowHeight
  const scrolledDistance = -rect.top

  const progress = Math.max(0, Math.min(1, scrolledDistance / totalDistance))
  approachProgress.value = progress
}

const whatWeDoTrackRef = ref<HTMLElement | null>(null)
const whatWeDoProgress = ref(0)

const handleWhatWeDoScroll = () => {
  if (!whatWeDoTrackRef.value) return
  const rect = whatWeDoTrackRef.value.getBoundingClientRect()
  const windowHeight = window.innerHeight

  const totalDistance = rect.height - windowHeight
  const scrolledDistance = -rect.top

  const progress = Math.max(0, Math.min(1, scrolledDistance / totalDistance))
  whatWeDoProgress.value = progress
}

const handleSubmit = async () => {
  isSubmitting.value = true
  errorMsg.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: {
        name: form.name,
        service: form.service,
        email: form.email,
        phone: form.phone,
        message: form.message
      }
    })
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
  } catch (err: unknown) {
    console.error('Failed to submit form:', err)
    const fetchError = err as { data?: { statusMessage?: string } }
    errorMsg.value = fetchError.data?.statusMessage || 'Failed to send your request. Please try again or email us directly.'
  } finally {
    isSubmitting.value = false
  }
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

  checkMobile()
  window.addEventListener('resize', checkMobile)

  window.addEventListener('scroll', handleScroll)
  window.addEventListener('scroll', handleApproachScroll)
  window.addEventListener('scroll', handleWhatWeDoScroll)
  window.addEventListener('resize', updateLogoOffset)
  handleScroll()
  handleApproachScroll()
  handleWhatWeDoScroll()

  nextTick(() => {
    updateLogoOffset()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', checkMobile)
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('scroll', handleApproachScroll)
  window.removeEventListener('scroll', handleWhatWeDoScroll)
  window.removeEventListener('resize', updateLogoOffset)
})
</script>

<template>
  <div>
    <!-- Unified Scroll Track (400vh height for Hero + About Us scroll story) -->
    <section
      ref="aboutTrackRef"
      :class="isMobile ? 'relative h-auto bg-transparent' : 'relative h-[400vh] bg-transparent'"
    >
      <!-- Pinned Viewport Container (Sticky h-screen) -->
      <div :class="isMobile ? 'relative h-auto w-full bg-[#1D96B8]' : 'sticky top-0 h-screen w-full overflow-hidden bg-brand-dark'">
        <!-- 1. Hero Section (Pinned and fades out) -->
        <div
          :class="isMobile ? 'relative z-20' : 'absolute inset-0 z-20 transition-opacity duration-75'"
          :style="isMobile ? {} : { opacity: heroOpacity, pointerEvents: heroOpacity > 0 ? 'auto' : 'none' }"
        >
          <PageHero
            title-html="FEEL THE <span class=&quot;text-brand-yellow-500&quot;>WOO</span>"
            :image="settings.indexHeroImage"
            :video="settings.indexHeroVideo"
            description="From strategy to storytelling, we create brands, campaigns, and content that don't just look good but perform, connect, and grow."
            image-class="!opacity-60"
            :class="isMobile ? 'min-h-[calc(100vh-80px)]' : 'h-full w-full'"
            :image-style="isMobile ? {} : heroBgStyle"
            :content-style="isMobile ? {} : heroContentStyle"
          />
        </div>

        <!-- 2. Sliding/Fading Teal Background Overlay -->
        <div
          v-if="!isMobile"
          class="absolute inset-0 bg-[#1D96B8] transition-opacity duration-75 z-10"
          :style="backgroundStyle"
        />

        <!-- 3. About Us Content Section -->
        <div
          :class="isMobile ? 'relative z-30 py-16 bg-[#1D96B8]' : 'absolute inset-0 flex items-center'"
          :style="aboutSectionStyle"
        >
          <div class="max-w-[1266px] w-full mx-auto px-6 md:px-8">
            <div class="flex flex-col md:flex-row gap-12 md:gap-20 items-center md:items-start relative">
              <!-- Left column -->
              <div class="md:w-[340px] shrink-0 flex flex-col gap-6 items-center md:items-start text-center md:text-left">
                <!-- ABOUT US label (fades in as teal bg arrives) -->
                <div
                  class="flex items-center gap-2 transition-opacity duration-300"
                  :style="{ opacity: labelOpacity }"
                >
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
                  <NuxtImg
                    src="/Images/Logo.png"
                    alt="Macawoo logo"
                    preload
                    format="webp"
                    class="absolute left-0 top-0 w-[140px] h-[140px] object-contain"
                    :style="logoStyle"
                  />
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
                  class="text-white text-[24px] sm:text-[28px] md:text-[36px] lg:text-[42px] font-semibold leading-[1.25]"
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
      </div>
    </section>

    <!-- What We Do -->
    <section
      ref="whatWeDoTrackRef"
      :class="isMobile ? 'relative h-auto bg-white' : 'relative h-[220vh] bg-white'"
    >
      <div :class="isMobile ? 'relative h-auto w-full flex flex-col justify-between py-16 bg-white' : 'sticky top-0 h-screen w-full flex flex-col justify-between py-16 bg-white overflow-hidden'">
        <div class="max-w-[1266px] w-full mx-auto px-6 md:px-8 flex-1 flex flex-col justify-between gap-8">
          <!-- Header (Centered) -->
          <div class="text-center shrink-0">
            <h2
              class="text-[#1D96B8] text-3xl md:text-[48px] font-medium font-fredoka leading-tight"
            >
              What We Do
            </h2>
            <p
              class="text-zinc-600 mt-4 text-base md:text-xl font-normal leading-relaxed"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
            >
              We blend raw creative energy with executive precision to craft brands that command attention and drive growth.
            </p>
          </div>

          <!-- Cards Grid (Horizontal Alignment restored) -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-[13px] my-auto">
            <!-- Card 1: Branding & Design -->
            <NuxtLink
              to="/services/branding-design"
              class="relative rounded-[10px] overflow-hidden group block h-[280px] md:h-[420px] shadow-lg transition-all duration-700 ease-out"
              :class="[
                isMobile || whatWeDoProgress >= 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              ]"
            >
              <NuxtImg
                :src="settings.servicesBrandingImage"
                alt="Branding & Design"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
                style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
              />
              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <p
                  class="text-white text-[24px] md:text-[32px] font-normal leading-tight text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[133px] group-hover:translate-y-0"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  <span class="font-bold">Branding</span><br>&amp; Design
                </p>
              </div>
            </NuxtLink>

            <!-- Card 2: Digital Marketing -->
            <NuxtLink
              to="/services/digital-marketing"
              class="relative rounded-[10px] overflow-hidden group block h-[280px] md:h-[420px] shadow-lg transition-all duration-700 ease-out"
              :class="[
                isMobile || whatWeDoProgress >= 0.33 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
              ]"
            >
              <NuxtImg
                :src="settings.servicesMarketingImage"
                alt="Digital Marketing"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
                style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
              />
              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <p
                  class="text-white text-[24px] md:text-[32px] font-normal leading-tight text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[133px] group-hover:translate-y-0"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  <span class="font-bold">Digital</span><br>Marketing
                </p>
              </div>
            </NuxtLink>

            <!-- Card 3: Video Production -->
            <NuxtLink
              to="/services/video-production"
              class="relative rounded-[10px] overflow-hidden group block h-[280px] md:h-[420px] shadow-lg transition-all duration-700 ease-out"
              :class="[
                isMobile || whatWeDoProgress >= 0.66 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'
              ]"
            >
              <NuxtImg
                :src="settings.servicesVideoImage"
                alt="Video Production"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
              <div
                class="absolute inset-x-0 bottom-0 rounded-b-[10px]"
                style="top: 39.84%; background: linear-gradient(360deg, #000000 0%, rgba(0,0,0,0) 100%);"
              />
              <!-- Hover overlay -->
              <div
                class="absolute inset-0 bg-[#1D96B8] opacity-0 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
              />
              <div class="absolute inset-0 flex items-center justify-center">
                <p
                  class="text-white text-[24px] md:text-[32px] font-normal leading-tight text-center transition-transform duration-500 ease-out translate-y-[96px] md:translate-y-[133px] group-hover:translate-y-0"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  <span class="font-bold">Video</span><br>Production
                </p>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </section>

    <!-- Client Logos Carousel (Positioned outside sticky container to prevent overlap) -->
    <section class="py-10 md:py-14 bg-white border-b border-zinc-100">
      <div class="max-w-[1266px] w-full mx-auto px-6 md:px-8">
        <ClientLogos />
      </div>
    </section>

    <!-- Featured Work -->
    <FeaturedWork />

    <!-- Our Approach -->
    <section
      ref="approachTrackRef"
      :class="isMobile ? 'relative h-auto bg-white' : 'relative h-[220vh] bg-white'"
    >
      <div :class="isMobile ? 'relative h-auto w-full flex flex-col justify-center py-16 bg-white' : 'sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center py-12 md:py-20 bg-white'">
        <div class="max-w-[1266px] w-full mx-auto px-6 md:px-8 flex-1 flex flex-col justify-center gap-8">
          <!-- Header -->
          <div class="mb-6 md:mb-16">
            <h2
              class="text-[#1D96B8] text-3xl md:text-[48px] font-medium font-fredoka leading-tight"
            >
              Our Approach
            </h2>
            <p class="text-zinc-600 mt-3 text-base md:text-xl font-normal leading-relaxed">
              We don't just execute we build systems for growth.
            </p>
          </div>

          <!-- Timeline Container -->
          <div class="relative w-full max-w-4xl mx-auto pl-16 md:pl-28 py-4">
            <!-- Stretching Yellow Pill background -->
            <div
              class="absolute left-4 md:left-6 top-0 w-16 md:w-24 bg-gradient-to-b from-[#FCFFC1] to-[#E8F600] rounded-t-full rounded-b-full transition-all duration-75 ease-out z-0"
              :style="{ height: isMobile ? '100%' : (approachProgress === 0 ? '80px' : `calc(80px + (100% - 80px) * ${approachProgress})`) }"
            />

            <!-- Steps -->
            <div class="relative z-10 flex flex-col gap-12 md:gap-20 py-4">
              <!-- Step 1: Think -->
              <div class="flex items-center relative min-h-[64px] md:min-h-[80px]">
                <div class="absolute left-[-40px] md:left-[-80px] w-12 md:w-20 flex justify-center">
                  <div
                    class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-fredoka font-semibold text-base md:text-xl bg-[#201F1F] text-white transition-all duration-300 shadow-md"
                  >
                    01
                  </div>
                </div>
                <div class="pl-4 md:pl-8">
                  <h3
                    class="text-xl md:text-[28px] font-medium text-zinc-950 leading-none"
                    style="font-family: 'Fredoka', sans-serif;"
                  >
                    Think
                  </h3>
                  <p
                    class="text-zinc-600 text-sm md:text-lg mt-3 max-w-2xl leading-relaxed"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >
                    We uncover insights, define strategy, and create a clear roadmap for success.
                  </p>
                </div>
              </div>

              <!-- Step 2: Create -->
              <div
                class="flex items-center relative min-h-[64px] md:min-h-[80px] transition-all duration-700 ease-out"
                :class="isMobile || approachProgress >= 0.35 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'"
              >
                <div class="absolute left-[-40px] md:left-[-80px] w-12 md:w-20 flex justify-center">
                  <div
                    class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-fredoka font-semibold text-base md:text-xl transition-all duration-300"
                    :class="[
                      isMobile || approachProgress >= 0.5
                        ? 'bg-[#201F1F] text-white scale-100 shadow-md'
                        : 'bg-zinc-200 text-zinc-400 scale-90'
                    ]"
                  >
                    02
                  </div>
                </div>
                <div class="pl-4 md:pl-8">
                  <h3
                    class="text-xl md:text-[28px] font-medium text-zinc-950 leading-none"
                    style="font-family: 'Fredoka', sans-serif;"
                  >
                    Create
                  </h3>
                  <p
                    class="text-zinc-600 text-sm md:text-lg mt-3 max-w-2xl leading-relaxed"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >
                    We craft compelling brand experiences that connect with your audience.
                  </p>
                </div>
              </div>

              <!-- Step 3: Scale -->
              <div
                class="flex items-center relative min-h-[64px] md:min-h-[80px] transition-all duration-700 ease-out"
                :class="isMobile || approachProgress >= 0.70 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'"
              >
                <div class="absolute left-[-40px] md:left-[-80px] w-12 md:w-20 flex justify-center">
                  <div
                    class="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center font-fredoka font-semibold text-base md:text-xl transition-all duration-300"
                    :class="[
                      isMobile || approachProgress >= 0.85
                        ? 'bg-[#201F1F] text-white scale-100 shadow-md'
                        : 'bg-zinc-200 text-zinc-400 scale-90'
                    ]"
                  >
                    03
                  </div>
                </div>
                <div class="pl-4 md:pl-8">
                  <h3
                    class="text-xl md:text-[28px] font-medium text-zinc-950 leading-none"
                    style="font-family: 'Fredoka', sans-serif;"
                  >
                    Scale
                  </h3>
                  <p
                    class="text-zinc-600 text-sm md:text-lg mt-3 max-w-2xl leading-relaxed"
                    style="font-family: 'Bricolage Grotesque', sans-serif;"
                  >
                    We accelerate growth through optimization, performance, and continuous innovation.
                  </p>
                </div>
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
            <!-- Glassmorphism Grid Overlay on the image -->
            <GlassGrid :grids="15" />
            <!-- Gradient Overlay for readability -->
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent z-10" />

            <!-- Text Content -->
            <div class="relative z-20">
              <h2
                class="text-white text-3xl md:text-4xl lg:text-[42px] font-medium leading-[1.2] tracking-tight"
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
              <h3 class="text-2xl font-medium text-white mb-2">
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
              <div
                v-if="errorMsg"
                class="p-4 bg-rose-950/45 border border-rose-500/35 text-rose-200 rounded-xl text-sm font-semibold leading-relaxed"
              >
                {{ errorMsg }}
              </div>

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

    <!-- SVG Disperse Filter for Hero Text Dissolve -->
    <svg
      class="absolute w-0 h-0 pointer-events-none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <filter id="hero-disperse">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="3"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            :scale="disperseScale"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </defs>
    </svg>
  </div>
</template>
