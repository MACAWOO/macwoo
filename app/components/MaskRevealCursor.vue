<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const route = useRoute()

const isMounted = ref(false)
const isMobile = ref(false)
// Firefox repaints CSS masks on the CPU every frame and gives no compositor
// fast-path for a full-viewport masked layer. The DOM-clone + per-frame
// radial-gradient mask reveal therefore tanks performance and flickers in FF.
// Detect it and skip the whole overlay pipeline, keeping only the cheap
// transform-based cursor dots.
const isFirefox = ref(false)
const isVisible = ref(false)
const isHovering = ref(false)

// Mouse coordinates
const mouseX = ref(0)
const mouseY = ref(0)
const currentX = ref(0)
const currentY = ref(0)
const hasMoved = ref(false)

// Spotlight radius (lerped for fluid feel)
const targetRadius = ref(30) // default 30px radius = 60px diameter
const currentRadius = ref(30)

const clonedScrollContainer = ref(null)

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
  if (typeof document === 'undefined' || isFirefox.value) return

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
  debounceTimeout = setTimeout(syncDOM, 150)
}

// Scroll Syncing
const syncScroll = () => {
  if (isFirefox.value) return
  if (clonedScrollContainer.value) {
    clonedScrollContainer.value.scrollTop = window.scrollY
    clonedScrollContainer.value.scrollLeft = window.scrollX
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

const handleMouseLeave = () => {
  isVisible.value = false
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
    // Smooth follow with lerp
    currentX.value = lerp(currentX.value, mouseX.value, 0.12)
    currentY.value = lerp(currentY.value, mouseY.value, 0.12)
    currentRadius.value = lerp(currentRadius.value, targetRadius.value, 0.12)

    // Sync scroll in animation loop for smoothness (overlay only; no-op on FF)
    if (!isFirefox.value) syncScroll()
  }
  rafId = requestAnimationFrame(updateCursor)
}

// Route changed watcher
watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) return
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
  isFirefox.value = typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)

  if (!isMobile.value) {
    // The DOM-clone + MutationObserver only feed the masked reveal overlay,
    // which is disabled on Firefox. Skip them there — they are pure overhead.
    if (!isFirefox.value) {
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
          subtree: true,
          attributes: true,
          attributeFilter: ['class', 'style', 'src', 'href']
        })
      }
    }

    // Listeners
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
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
  
  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
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
  const scale = currentRadius.value / 30
  return {
    transform: `translate3d(-50%, -50%, 0) translate3d(${currentX.value}px, ${currentY.value}px, 0) scale(${scale})`
  }
})

const overlayStyle = computed(() => ({
  opacity: isExcludedSection.value ? 0 : 1,
  transition: 'opacity 0.25s ease'
}))

const zoomStyle = computed(() => {
  const x = currentX.value
  const y = currentY.value
  return {
    'transform-origin': `${x}px ${y}px`,
    'transform': `scale(1.08) translate3d(0, 0, 0)`
  }
})
</script>

<template>
  <div v-if="isMounted && !isMobile" class="custom-cursor-wrapper">
    <!-- Overlay Layer for Swapped Colors (disabled on Firefox: CPU mask repaint) -->
    <div
      v-if="!isFirefox"
      id="reveal-overlay-wrapper"
      :style="overlayStyle"
    >
      <div 
        id="reveal-overlay" 
        :style="maskStyle"
      >
        <div 
          ref="clonedScrollContainer" 
          class="cloned-scroll-container"
          :style="zoomStyle"
        >
          <div id="cloned-site"></div>
        </div>
      </div>
    </div>

    <!-- Premium Custom Cursor Indicators -->
    <div class="custom-cursor-dot-target" :style="targetDotStyle"></div>
    <div class="custom-cursor-dot-lerp" :style="lerpDotStyle"></div>
  </div>
</template>
