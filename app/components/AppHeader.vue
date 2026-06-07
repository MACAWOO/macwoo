<script setup lang="ts">
const isMenuOpen = ref(false)
const isServicesOpen = ref(false)
const isScrolled = ref(false)

// ── Sliding glass pill state ──
const navLinksRef = ref<HTMLElement | null>(null)
const glassLeft = ref(0)
const glassWidth = ref(0)
const glassOpacity = ref(0)
const isHovering = ref(false)

const services = [
  { label: 'Branding & Design', to: '/services/branding-design' },
  { label: 'Digital Marketing', to: '/services/digital-marketing' },
  { label: 'Video Production', to: '/services/video-production' },
]

const route = useRoute()
const isPathActive = (path: string) => {
  if (path === '/') return route.path === '/'
  if (path.startsWith('/services')) return route.path.startsWith('/services')
  return route.path.startsWith(path)
}

// Move glass pill to hovered element
const moveGlassTo = (event: MouseEvent) => {
  const target = (event.currentTarget as HTMLElement)
  const container = navLinksRef.value
  if (!target || !container) return

  const containerRect = container.getBoundingClientRect()
  const targetRect = target.getBoundingClientRect()

  glassLeft.value = targetRect.left - containerRect.left
  glassWidth.value = targetRect.width
  glassOpacity.value = 1
  isHovering.value = true
}

// Snap glass pill to the active item or hide
const resetGlass = () => {
  isHovering.value = false
  // Find the active nav item and snap to it
  nextTick(() => {
    const container = navLinksRef.value
    if (!container) return
    const activeEl = container.querySelector('[data-nav-active="true"]') as HTMLElement
    if (activeEl) {
      const containerRect = container.getBoundingClientRect()
      const activeRect = activeEl.getBoundingClientRect()
      glassLeft.value = activeRect.left - containerRect.left
      glassWidth.value = activeRect.width
      glassOpacity.value = 1
    } else {
      glassOpacity.value = 0
    }
  })
}

let rafId = 0
const onScroll = () => {
  if (rafId) return
  rafId = requestAnimationFrame(() => {
    const scrolled = window.scrollY > 60
    if (isScrolled.value !== scrolled) {
      isScrolled.value = scrolled
    }
    rafId = 0
  })
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  // Initialize glass position on active item
  nextTick(() => resetGlass())
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  if (rafId) cancelAnimationFrame(rafId)
})

// Re-position on route change
watch(() => route.path, () => {
  nextTick(() => resetGlass())
})
</script>

<template>
  <header class="fixed left-0 right-0 z-50 top-[32px] w-full pointer-events-none">
    <div class="w-full mx-auto px-8 md:px-16 lg:px-20 pointer-events-auto flex items-center justify-between gap-8">

      <!-- ── LOGO (fades out on scroll) ── -->
      <NuxtLink
        to="/"
        class="hidden md:block shrink-0 pointer-events-auto transition-all duration-500 ease-out"
        :class="isScrolled ? 'opacity-0 pointer-events-none -translate-x-3' : 'opacity-100 translate-x-0'"
      >
        <NavBarLogo />
      </NuxtLink>

      <!-- ═══════════════════════ DESKTOP NAV PILL ═══════════════════════ -->
      <nav
        class="hidden md:flex items-center gap-1 px-3 h-[56px] rounded-full"
        style="
          background: linear-gradient(90deg, #2094BA 0%, #2AA4C9 50%, #2095BB 100%);
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow:
            inset 0 1px 0 rgba(255,255,255,0.20),
            0 4px 24px rgba(0,0,0,0.10);
        "
      >

        <!-- ── Nav links wrapper (relative for glass pill) ── -->
        <div
          ref="navLinksRef"
          class="relative flex items-center gap-1"
          @mouseleave="resetGlass"
        >

          <!-- ▓▓ SLIDING GLASS PILL ▓▓ -->
          <div
            class="absolute top-0 h-full rounded-full pointer-events-none z-0 overflow-hidden"
            :style="{
              left: glassLeft + 'px',
              width: glassWidth + 'px',
              opacity: glassOpacity,
              transition: isHovering
                ? 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1), width 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease'
                : 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
              background: 'rgba(0,0,0,0.18)',
              border: '1px solid rgba(255,255,255,0.20)',
              backdropFilter: 'blur(40px) saturate(160%)',
              WebkitBackdropFilter: 'blur(40px) saturate(160%)',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.25), inset 0 -1px 1px rgba(255,255,255,0.04), 0 0 0 0.5px rgba(255,255,255,0.10), 0 8px 40px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.10)',
            }"
          >
            <!-- top shine — soft diffused highlight -->
            <div
              class="absolute inset-x-0 top-0 h-[6px] rounded-t-full"
              style="background: linear-gradient(180deg, rgba(255,255,255,0.18) 0%, transparent 100%);"
            ></div>
            <!-- inner refraction glow — primary -->
            <div
              class="absolute inset-0 rounded-full"
              style="background: radial-gradient(ellipse at 50% -30%, rgba(255,255,255,0.22) 0%, transparent 55%);"
            ></div>
            <!-- refraction band — side-lit caustic -->
            <div
              class="absolute inset-0 rounded-full"
              style="background: linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.06) 100%);"
            ></div>
            <!-- prismatic color shift — subtle rainbow refraction -->
            <div
              class="absolute inset-0 rounded-full opacity-[0.07]"
              style="background: linear-gradient(105deg, rgba(120,180,255,0.8) 0%, rgba(255,255,255,0) 25%, rgba(255,255,255,0) 75%, rgba(255,200,120,0.6) 100%);"
            ></div>
            <!-- bottom reflection bar -->
            <div
              class="absolute inset-x-4 bottom-[2px] h-[1px] rounded-full opacity-35"
              style="background: linear-gradient(90deg, transparent 10%, rgba(255,255,255,0.6) 50%, transparent 90%);"
            ></div>
            <!-- edge light (outer ring glow) -->
            <div
              class="absolute -inset-[0.5px] rounded-full opacity-50 pointer-events-none"
              style="background: transparent; box-shadow: inset 0 0 6px rgba(255,255,255,0.15);"
            ></div>
          </div>

          <!-- Home icon -->
          <NuxtLink
            to="/"
            aria-label="Home"
            :data-nav-active="isPathActive('/')"
            class="relative z-10 flex items-center justify-center w-[52px] h-[46px] rounded-full transition-colors duration-200 group/home"
            @mouseenter="moveGlassTo($event)"
          >
            <svg
              class="w-[22px] h-[22px] text-white transition-transform duration-300 group-hover/home:scale-110"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="1.8"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </NuxtLink>

          <!-- Services (with dropdown) -->
          <div
            class="relative"
            @mouseenter="isServicesOpen = true; moveGlassTo($event)"
            @mouseleave="isServicesOpen = false"
          >
            <NuxtLink
              to="/services/branding-design"
              :data-nav-active="isPathActive('/services')"
              class="relative z-10 flex items-center justify-center px-5 h-[46px] rounded-full text-white text-[20px] font-normal select-none"
              style="font-family: 'Bricolage Grotesque', sans-serif;"
              @mouseenter="moveGlassTo($event)"
            >
              Services
            </NuxtLink>

            <!-- Dropdown -->
            <Transition
              enter-active-class="transition duration-200 ease-out"
              enter-from-class="opacity-0 translate-y-1"
              enter-to-class="opacity-100 translate-y-0"
              leave-active-class="transition duration-150 ease-in"
              leave-from-class="opacity-100 translate-y-0"
              leave-to-class="opacity-0 translate-y-1"
            >
              <div
                v-if="isServicesOpen"
                class="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-56 rounded-2xl overflow-hidden z-50 py-1"
                style="background:rgba(18,40,70,0.85);backdrop-filter:blur(20px) saturate(180%);border:1px solid rgba(255,255,255,0.12);box-shadow:0 16px 48px rgba(0,0,0,0.3),inset 0 1px 0 rgba(255,255,255,0.1);"
              >
                <NuxtLink
                  v-for="service in services"
                  :key="service.to"
                  :to="service.to"
                  class="flex items-center gap-2 px-4 py-3 text-[15px] text-white/80 hover:text-white hover:bg-white/8 transition-colors border-b border-white/6 last:border-0"
                  style="font-family: 'Bricolage Grotesque', sans-serif;"
                >
                  {{ service.label }}
                </NuxtLink>
              </div>
            </Transition>
          </div>

          <!-- Portfolio -->
          <NuxtLink
            to="/portfolio"
            :data-nav-active="isPathActive('/portfolio')"
            class="relative z-10 flex items-center justify-center px-5 h-[46px] rounded-full text-white text-[20px] font-normal select-none"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
            @mouseenter="moveGlassTo($event)"
          >
            Portfolio
          </NuxtLink>

          <!-- Case Studies -->
          <NuxtLink
            to="/case-studies"
            :data-nav-active="isPathActive('/case-studies')"
            class="relative z-10 flex items-center justify-center px-5 h-[46px] rounded-full text-white text-[20px] font-normal select-none"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
            @mouseenter="moveGlassTo($event)"
          >
            Case Studies
          </NuxtLink>

          <!-- About -->
          <NuxtLink
            to="/about"
            :data-nav-active="isPathActive('/about')"
            class="relative z-10 flex items-center justify-center px-5 h-[46px] rounded-full text-white text-[20px] font-normal select-none"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
            @mouseenter="moveGlassTo($event)"
          >
            About
          </NuxtLink>

        </div>

        <!-- ── RIGHT: Get in Touch CTA ── -->
        <NuxtLink
          to="/contact"
          class="shrink-0 flex items-center justify-between pl-7 pr-6 h-[40px] rounded-full bg-white text-black transition-all duration-300 ease-out group/cta ml-2 hover:-translate-y-[1px]"
        >
          <span
            class="font-bold text-[20px] leading-none whitespace-nowrap select-none mr-5"
            style="font-family: 'Bricolage Grotesque', sans-serif;"
          >Get in Touch</span>
          <svg
            class="w-[16px] h-[16px] shrink-0 transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0.0349998 9.348L1.305 10.74L7.879 4.679C7.243 6.979 7.854 9.432 9.285 11.506L10.744 10.175C8.797 7.436 8.738 3.803 11.303 1.462L10.186 0.238C7.621 2.579 4.009 2.189 1.458 0L0 1.331C1.934 2.945 4.322 3.777 6.67 3.355L0.0349998 9.348Z" fill="currentColor" />
          </svg>
        </NuxtLink>

      </nav>

      <!-- ═══════════════════════ MOBILE NAV ═══════════════════════ -->
      <div
        class="md:hidden flex items-center justify-between px-4 h-[58px] rounded-full w-full"
        style="background: linear-gradient(90deg, #2094BA 0%, #2AA4C9 50%, #2095BB 100%); border:1px solid rgba(255,255,255,0.18);"
      >
        <NavBarLogo class="shrink-0" />
        <button
          class="text-white p-2 rounded-full hover:bg-white/10 transition-colors"
          aria-label="Toggle menu"
          @click="isMenuOpen = !isMenuOpen"
        >
          <svg v-if="!isMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile menu panel -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div
          v-if="isMenuOpen"
          class="md:hidden mt-2 rounded-2xl overflow-hidden px-4 py-4 flex flex-col gap-2"
          style="background:rgba(18,40,70,0.92);backdrop-filter:blur(20px);border:1px solid rgba(255,255,255,0.12);"
        >
          <NuxtLink to="/" class="text-white/80 hover:text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/8 transition-colors" @click="isMenuOpen = false">Home</NuxtLink>
          <div class="text-white/40 text-xs font-semibold uppercase tracking-widest px-3 pt-1">Services</div>
          <NuxtLink
            v-for="service in services"
            :key="service.to"
            :to="service.to"
            class="text-white/80 hover:text-white text-sm font-medium py-2 px-5 rounded-xl hover:bg-white/8 transition-colors"
            @click="isMenuOpen = false"
          >{{ service.label }}</NuxtLink>
          <div class="border-t border-white/10 my-1" />
          <NuxtLink to="/portfolio" class="text-white/80 hover:text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/8 transition-colors" @click="isMenuOpen = false">Portfolio</NuxtLink>
          <NuxtLink to="/case-studies" class="text-white/80 hover:text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/8 transition-colors" @click="isMenuOpen = false">Case Studies</NuxtLink>
          <NuxtLink to="/about" class="text-white/80 hover:text-white text-sm font-medium py-2 px-3 rounded-xl hover:bg-white/8 transition-colors" @click="isMenuOpen = false">About</NuxtLink>
          <div class="border-t border-white/10 my-1" />
          <NuxtLink
            to="/contact"
            class="group/cta flex items-center justify-center gap-2 bg-white text-black font-bold text-sm py-3 px-5 rounded-full hover:bg-zinc-100 transition-colors"
            @click="isMenuOpen = false"
          >
            Get in Touch
            <svg
              class="w-[12px] h-[12px] transition-transform duration-300 ease-out group-hover/cta:translate-x-[2px] group-hover/cta:-translate-y-[2px]"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.0349998 9.348L1.305 10.74L7.879 4.679C7.243 6.979 7.854 9.432 9.285 11.506L10.744 10.175C8.797 7.436 8.738 3.803 11.303 1.462L10.186 0.238C7.621 2.579 4.009 2.189 1.458 0L0 1.331C1.934 2.945 4.322 3.777 6.67 3.355L0.0349998 9.348Z" fill="currentColor" />
            </svg>
          </NuxtLink>
        </div>
      </Transition>

    </div>
  </header>
</template>
