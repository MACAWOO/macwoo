<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const route = useRoute()

const isMounted = ref(false)
const isMobile = ref(false)
const isVisible = ref(false)
const isHovering = ref(false)

// Firefox cannot reliably composite the full-DOM mask-reveal overlay: the
// radial mask fails to clip when a scaled/composited clone is inside it, and
// scrollTop on a transformed overflow container drifts -> doubled/offset
// "ghost" text. We keep the custom cursor RING in Firefox (renders fine) but
// disable the heavy clone-reveal overlay there. Chromium/WebKit composite it
// correctly, so they keep the full effect.
const supportsReveal = ref(true)

// Mouse coordinates
const mouseX = ref(0)
const mouseY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const hasMoved = ref(false)

// Spotlight radius (lerped for fluid feel)
const targetRadius = ref(30) // default 30px radius = 60px diameter
const currentRadius = ref(30)

// Click / press feedback
const isPressed = ref(false)

// Velocity (for directional squash-stretch + speed-reactive scale)
const velX = ref(0)
const velY = ref(0)
let lastMouseX = 0
let lastMouseY = 0

// Idle auto-fade
const isIdle = ref(false)
let idleTimeout = null

// Respect reduced-motion preference
const reducedMotion = ref(false)

const scrollX = ref(0)
const scrollY = ref(0)

// Animation Frame ID
let rafId = null

// Mutation Observer
let observer = null
let debounceTimeout = null

// Mobile check helper
const checkMobile = () => {
  if (typeof window === 'undefined') return true
  const hasCoarsePointer = window.matchMedia('(pointer: coarse)').matches
  const isNarrowScreen = window.innerWidth < 1024 // Disable custom cursor on tablets & mobile
  return hasCoarsePointer || isNarrowScreen
}

// Clone and Sanitize DOM
const syncDOM = () => {
  if (typeof document === 'undefined') return

  const original = document.getElementById('original-site')
  const clonedSite = document.getElementById('cloned-site')
  if (!original || !clonedSite) return
  
  // Clone the node tree
  const clone = original.cloneNode(true)
  
  // Clean up interactive/resource-heavy elements
  const selectorsToStrip = [
    'iframe', 
    'video', 
    'audio', 
    'script', 
    'object', 
    'embed',
    '.chat-widget-container', 
    '.drift-frame-controller', 
    '#hubspot-messages-iframe-container',
    '#drift-widget'
  ]
  selectorsToStrip.forEach(selector => {
    clone.querySelectorAll(selector).forEach(el => el.remove())
  })
  
  // Remove IDs to avoid duplicates in the DOM
  clone.removeAttribute('id')
  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'))
  
  // Make the entire clone inert so it doesn't accept tab focus or screen reader announcements
  clone.setAttribute('inert', '')
  
  // Swap the contents
  clonedSite.innerHTML = ''
  clonedSite.appendChild(clone)
  
  // Immediate scroll sync after appending
  syncScroll()
}

// Debounced sync helper
const queueSyncDOM = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(syncDOM, 400)
}

// Scroll Syncing
const syncScroll = () => {
  if (typeof window !== 'undefined') {
    scrollX.value = window.scrollX
    scrollY.value = window.scrollY
  }
}

const isExcludedSection = ref(false)
const isCursorHidden = ref(false)

// Main Mouse Move Handler
const handleMouseMove = (e) => {
  if (isMobile.value) return
  
  if (!hasMoved.value) {
    hasMoved.value = true
    currentX.value = e.clientX
    currentY.value = e.clientY
  }
  
  mouseX.value = e.clientX
  mouseY.value = e.clientY
  isVisible.value = true

  // Track velocity for squash-stretch / speed reactivity
  velX.value = e.clientX - lastMouseX
  velY.value = e.clientY - lastMouseY
  lastMouseX = e.clientX
  lastMouseY = e.clientY

  // Wake from idle, re-arm idle timer
  isIdle.value = false
  if (idleTimeout) clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    isIdle.value = true
  }, 2500)

  const target = e.target
  if (target) {
    // Check if hovering over interactive elements
    const isInteractive = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .interactive-cursor') !== null
    isHovering.value = isInteractive
    targetRadius.value = isInteractive ? 45 : 30

    // Check if hovering over hero section or navbar header
    const insideHero = target.closest('.site-hero-section') !== null
    const insideHeader = target.closest('header, .site-header-section') !== null
    const insideExclude = target.closest('.site-exclude-reveal') !== null
    
    isExcludedSection.value = insideHero || insideHeader || insideExclude
    isCursorHidden.value = insideExclude

    if (isCursorHidden.value) {
      document.body.classList.remove('custom-cursor-active')
    } else {
      document.body.classList.add('custom-cursor-active')
    }
  }
}

const handleMouseDown = () => {
  if (isMobile.value) return
  isPressed.value = true
}

const handleMouseUp = () => {
  isPressed.value = false
}

const handleMouseLeave = () => {
  isVisible.value = false
  isPressed.value = false
  document.body.classList.remove('custom-cursor-active')
}

const handleMouseEnter = () => {
  if (!isMobile.value && hasMoved.value) {
    isVisible.value = true
    if (!isCursorHidden.value) {
      document.body.classList.add('custom-cursor-active')
    }
  }
}

// Lerp helper
const lerp = (start, end, factor) => start + (end - start) * factor

// Animation Loop
const updateCursor = () => {
  if (!isMobile.value) {
    // Snappier follow when hovering interactive targets so the ring feels
    // "locked on"; reduced-motion users get an instant snap.
    const follow = reducedMotion.value ? 1 : (isHovering.value ? 0.2 : 0.14)
    currentX.value = lerp(currentX.value, mouseX.value, follow)
    currentY.value = lerp(currentY.value, mouseY.value, follow)
    currentRadius.value = lerp(currentRadius.value, targetRadius.value, follow)

    // Ease velocity toward 0 so squash-stretch relaxes when the mouse stops
    velX.value = lerp(velX.value, 0, 0.2)
    velY.value = lerp(velY.value, 0, 0.2)

    // Sync scroll in animation loop for smoothness
    syncScroll()
  }
  rafId = requestAnimationFrame(updateCursor)
}

// Route changed watcher
watch(
  () => route.fullPath,
  () => {
    if (isMobile.value || !supportsReveal.value) return
    nextTick(() => {
      syncDOM()
      // Multiple fallbacks for dynamic content loads or route transition durations
      setTimeout(syncDOM, 300)
      setTimeout(syncDOM, 600)
      setTimeout(syncDOM, 1000)
    })
  }
)

onMounted(() => {
  isMounted.value = true
  isMobile.value = checkMobile()
  reducedMotion.value = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  supportsReveal.value = true

  if (!isMobile.value) {
    // Only build/sync the DOM clone where the mask-reveal overlay is reliable.
    if (supportsReveal.value) {
      // Build initial clone
      syncDOM()

      // Set up MutationObserver to sync content changes on the live site
      const original = document.getElementById('original-site')
      if (original) {
        observer = new MutationObserver(() => {
          queueSyncDOM()
        })
        observer.observe(original, {
          childList: true,
          subtree: true
        })
      }
    }

    // Listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('scroll', syncScroll, { passive: true })
    window.addEventListener('resize', () => {
      isMobile.value = checkMobile()
      if (!isMobile.value) {
        syncDOM()
      } else {
        document.body.classList.remove('custom-cursor-active')
      }
    }, { passive: true })
    
    // Start animation loop
    updateCursor()
  }
})

onBeforeUnmount(() => {
  if (rafId) cancelAnimationFrame(rafId)
  if (observer) observer.disconnect()
  if (debounceTimeout) clearTimeout(debounceTimeout)
  if (idleTimeout) clearTimeout(idleTimeout)

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
    window.removeEventListener('scroll', syncScroll)
    window.removeEventListener('resize', checkMobile)
    document.body.classList.remove('custom-cursor-active')
  }
})

// Styles computed dynamically for inline bindings
const maskStyle = computed(() => {
  const x = currentX.value
  const y = currentY.value
  const r = currentRadius.value
  const gradient = `radial-gradient(circle ${r}px at ${x}px ${y}px, black 0%, black 80%, transparent 100%)`
  return {
    // mask-image + mask-repeat + mask-size are ALL required for Firefox.
    // Firefox defaults mask-repeat to 'repeat', which tiles the small
    // radial-gradient spotlight across the entire overlay, making it
    // permanently visible instead of only at the cursor position.
    '-webkit-mask-image': gradient,
    '-webkit-mask-repeat': 'no-repeat',
    '-webkit-mask-size': '100% 100%',
    'mask-image': gradient,
    'mask-repeat': 'no-repeat',
    'mask-size': '100% 100%'
  }
})

const targetDotStyle = computed(() => {
  if (!isVisible.value || !hasMoved.value || isCursorHidden.value) return { display: 'none' }
  return {
    transform: `translate3d(-50%, -50%, 0) translate3d(${mouseX.value}px, ${mouseY.value}px, 0)`
  }
})

const lerpDotStyle = computed(() => {
  if (!isVisible.value || !hasMoved.value || isCursorHidden.value) return { display: 'none' }

  const base = currentRadius.value / 30
  const press = isPressed.value ? 0.8 : 1 // compress on click
  const scale = base * press

  // Directional squash-stretch: ring elongates along travel direction,
  // proportional to speed (capped so fast flicks don't distort wildly).
  let rotate = ''
  let axis = 'scale(1)'
  if (!reducedMotion.value) {
    const speed = Math.hypot(velX.value, velY.value)
    const stretch = Math.min(speed / 200, 0.4) // 0 → 0.4
    if (speed > 0.5) {
      const angle = (Math.atan2(velY.value, velX.value) * 180) / Math.PI
      rotate = ` rotate(${angle}deg)`
      axis = ` scale(${1 + stretch}, ${1 - stretch * 0.6})`
    }
  }

  return {
    transform: `translate3d(-50%, -50%, 0) translate3d(${currentX.value}px, ${currentY.value}px, 0) scale(${scale})${rotate}${axis}`,
    opacity: isIdle.value ? 0.35 : 1
  }
})

const overlayStyle = computed(() => ({
  opacity: isExcludedSection.value ? 0 : 1,
  transition: 'opacity 0.25s ease'
}))

const cloneStyle = computed(() => {
  const x = currentX.value
  const y = currentY.value
  return {
    'transform-origin': `${x}px ${y}px`,
    'transform': `scale(1.08) translate3d(-${scrollX.value}px, -${scrollY.value}px, 0)`
  }
})
</script>

<template>
  <div v-if="isMounted && !isMobile" class="custom-cursor-wrapper">
    <!-- Overlay Layer for Swapped Colors (Chromium/WebKit only — Firefox
         cannot composite the masked clone without ghosting, so it falls back
         to just the cursor ring below) -->
    <div
      v-if="supportsReveal"
      id="reveal-overlay-wrapper"
      :style="overlayStyle"
    >
      <div 
        id="reveal-overlay" 
        :style="maskStyle"
      >
        <div 
          id="cloned-site"
          :style="cloneStyle"
        ></div>
      </div>
    </div>

    <!-- Premium Custom Cursor Indicators -->
    <div class="custom-cursor-dot-target" :style="targetDotStyle"></div>
    <div
      class="custom-cursor-dot-lerp"
      :class="{ 'is-interactive': isHovering, 'is-pressed': isPressed }"
      :style="lerpDotStyle"
    ></div>
  </div>
</template>
