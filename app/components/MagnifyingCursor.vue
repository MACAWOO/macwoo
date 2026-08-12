<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'

const route = useRoute()

const ZOOM = 1.35

const isMounted = ref(false)
const isMobile = ref(false)
const isVisible = ref(false)
const isHovering = ref(false)
const isPressed = ref(false)
// No magnifying effect over the nav bar or chat widget — lens fades out,
// target dot stays
const isOverHeader = ref(false)
const LENS_EXCLUDE_SELECTOR = 'header, .chat-widget-container, .no-reveal-spotlight, .site-exclude-reveal, .no-reveal-magnifier'
const hasMoved = ref(false)

// Dynamic spotlight radius (default 28px radius = 56px diameter ring; 42px on interactive hover)
const targetRadius = ref(28)
const currentRadius = ref(28)

// Mouse coordinates (viewport space)
const mouseX = ref(0)
const mouseY = ref(0)
const currentX = ref(0)
const currentY = ref(0)

// Scroll coordinates
const scrollX = ref(0)
const scrollY = ref(0)

let rafId = null
let observer = null
let debounceTimeout = null
let idleTimeout = null
let hoverTimeout = null
let routeTimeout = null
let clonedHeader = null
let cloneRoot = null
// position:sticky pairs — sticky never engages inside the lens (the clone sits
// in a transformed, overflow:hidden container that never scrolls), so each
// clone counterpart is offset manually to match the original's stuck position.
let stickyPairs = []

// Animation sync state
let animPairs = new Map()
let dirtyAnimEls = new Set()
let pendingAttrPatches = new Map()
let cloneNodeCache = new WeakMap()
const ANIM_EVENTS = [
  'transitionrun',
  'transitionend',
  'transitioncancel',
  'animationstart',
  'animationend',
  'animationcancel'
]

// ── Hover state mirroring ─────────────────────────────────────────────────
// The clone is never under the pointer, so `:hover` never matches inside it and
// every hover-driven colour/transform renders in its base state. Hover also
// changes no attribute, so the MutationObserver has nothing to sync.
//
// Instead, every `:hover` rule on the page is duplicated once with `:hover`
// rewritten to `[data-mag-hover]` and the whole selector scoped under
// #magnifier-clone. Marking the clone counterparts of the hovered ancestor
// chain then reproduces the real hover state — including `group-hover`, which
// Tailwind emits as a nested `&:is(:where(.group):hover *)` rule.
const HOVER_ATTR = 'data-mag-hover'
const HOVER_SCOPE = '#magnifier-clone'
const HOVER_STYLE_ID = 'magnifier-hover-styles'

let hoverStyleEl = null
let hoverSheetSignature = ''
let hoverChain = []
let lastHoverTarget = null

// Comma-split a selector list without breaking on commas inside :is()/:where(),
// attribute values, or escapes (Tailwind class names are full of `\:`).
const splitSelectorList = (text) => {
  const parts = []
  let depth = 0
  let quote = null
  let cur = ''

  for (let i = 0; i < text.length; i++) {
    const ch = text[i]

    if (ch === '\\') {
      cur += ch + (text[i + 1] || '')
      i++
      continue
    }
    if (quote) {
      cur += ch
      if (ch === quote) quote = null
      continue
    }
    if (ch === '\'' || ch === '"') {
      quote = ch
      cur += ch
      continue
    }
    if (ch === '(' || ch === '[') depth++
    else if (ch === ')' || ch === ']') depth--
    else if (ch === ',' && depth === 0) {
      parts.push(cur.trim())
      cur = ''
      continue
    }
    cur += ch
  }
  if (cur.trim()) parts.push(cur.trim())
  return parts
}

// Keep only the hover branches of a selector list, rewritten and clone-scoped.
// Each branch is prefixed individually — a shared prefix would leave the
// non-hover branches applying to the whole document.
const scopeHoverSelector = (selectorText) => {
  const out = []
  for (const sel of splitSelectorList(selectorText)) {
    if (!sel.includes(':hover')) continue
    out.push(`${HOVER_SCOPE} ${sel.replace(/:hover/g, `[${HOVER_ATTR}]`)}`)
  }
  return out.join(',')
}

// Prelude for a grouping rule that must be preserved. `null` means unwrap the
// rule and keep its contents — correct for @layer, whose cascade position the
// scoped copy must not inherit.
const groupPrelude = (rule) => {
  if (typeof CSSMediaRule !== 'undefined' && rule instanceof CSSMediaRule) {
    return `@media ${rule.media.mediaText}`
  }
  if (typeof CSSSupportsRule !== 'undefined' && rule instanceof CSSSupportsRule) {
    return `@supports ${rule.conditionText}`
  }
  if (typeof CSSContainerRule !== 'undefined' && rule instanceof CSSContainerRule) {
    return `@container ${rule.containerName ? `${rule.containerName} ` : ''}${rule.containerQuery || ''}`
  }
  return null
}

// Walk a rule list, resolving CSS nesting into flat effective selectors.
const collectHoverCss = (rules, parentSel) => {
  let css = ''

  for (const rule of rules) {
    const isStyleRule = typeof CSSStyleRule !== 'undefined' && rule instanceof CSSStyleRule

    if (isStyleRule) {
      const own = rule.selectorText || ''
      let effective = own
      if (parentSel) {
        effective = own.includes('&')
          ? own.replace(/&/g, `:is(${parentSel})`)
          : `:is(${parentSel}) ${own}`
      }

      if (effective.includes(':hover') && rule.style.cssText) {
        const scoped = scopeHoverSelector(effective)
        if (scoped) css += `${scoped}{${rule.style.cssText}}`
      }

      if (rule.cssRules && rule.cssRules.length) {
        css += collectHoverCss(rule.cssRules, effective)
      }
      continue
    }

    if (rule.cssRules && rule.cssRules.length) {
      const inner = collectHoverCss(rule.cssRules, parentSel)
      if (!inner) continue
      const prelude = groupPrelude(rule)
      css += prelude ? `${prelude}{${inner}}` : inner
    }
  }

  return css
}

// Rebuild the scoped hover stylesheet. Cheap enough to run per route change —
// a signature check skips the scan when no stylesheet was added or removed.
const buildHoverStyles = (force = false) => {
  if (typeof document === 'undefined') return

  const sheets = Array.from(document.styleSheets)
  const signature = sheets.map(s => `${s.href || 'inline'}:${s.disabled}`).join('|')
  if (!force && signature === hoverSheetSignature && hoverStyleEl) return
  hoverSheetSignature = signature

  let css = ''
  for (const sheet of sheets) {
    if (sheet.ownerNode === hoverStyleEl) continue
    let rules
    try {
      rules = sheet.cssRules
    } catch {
      // Cross-origin stylesheet — rules are unreadable
      continue
    }
    if (rules) css += collectHoverCss(rules, null)
  }

  if (!hoverStyleEl) {
    hoverStyleEl = document.createElement('style')
    hoverStyleEl.id = HOVER_STYLE_ID
    document.head.appendChild(hoverStyleEl)
  }
  hoverStyleEl.textContent = css
}

// Mark the clone counterparts of the hovered element and all its ancestors.
// Ancestors matter for `group-hover` and any descendant-combinator hover rule.
const updateHoverChain = (target) => {
  if (target === lastHoverTarget) return
  lastHoverTarget = target

  const original = document.getElementById('original-site')
  const next = []

  if (original && cloneRoot && target && target.nodeType === 1 && original.contains(target)) {
    let node = target
    while (node) {
      const cloneEl = resolveCloneNode(node)
      if (cloneEl) next.push(cloneEl)
      if (node === original) break
      node = node.parentElement
    }
  }

  for (const el of hoverChain) {
    if (!next.includes(el)) el.removeAttribute(HOVER_ATTR)
  }
  for (const el of next) el.setAttribute(HOVER_ATTR, '')
  hoverChain = next
}

// Re-mark after a reclone wiped the attributes, without waiting for a mousemove
const reapplyHoverChain = () => {
  hoverChain = []
  const target = lastHoverTarget
  if (!target) return
  lastHoverTarget = null
  updateHoverChain(target)
}

// Mobile / Coarse Pointer Check
const checkMobile = () => {
  if (typeof window === 'undefined') return true
  const noFinePointer = !window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const isNarrowScreen = window.innerWidth < 1024
  return noFinePointer || isNarrowScreen
}

// Scroll handler triggered strictly on scroll events
const handleScroll = () => {
  if (typeof window === 'undefined') return
  const newX = Math.round(window.scrollX)
  const newY = Math.round(window.scrollY)

  scrollX.value = newX
  scrollY.value = newY

  // Sync cloned header offset to match fixed header in viewport space.
  // Reference is cached at clone time — no per-scroll DOM query.
  if (clonedHeader) {
    clonedHeader.style.transform = `translate3d(0, ${newY}px, 0)`
  }

  // Reproduce sticky positioning inside the clone. All geometry was cached at
  // clone time, so this is pure arithmetic plus at most one style write per
  // sticky element — no layout reads.
  for (const pair of stickyPairs) {
    const delta = Math.min(
      Math.max(newY + pair.topOffset - pair.flowTop, 0),
      pair.maxDelta
    )
    if (delta !== pair.delta) {
      pair.delta = delta
      pair.cloneEl.style.transform = delta > 0 ? `translate3d(0, ${delta}px, 0)` : ''
    }
  }
}

// Named resize handler for clean listener removal
const handleResize = () => {
  isMobile.value = checkMobile()
  if (!isMobile.value) {
    syncDOM()
  } else {
    document.body.classList.remove('custom-cursor-active')
  }
}

const STRIP_SELECTOR = [
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
].join(', ')

// Clone and sanitize DOM tree into the magnifier container
const syncDOM = () => {
  if (typeof document === 'undefined') return

  const original = document.getElementById('original-site')
  const clonedContainer = document.getElementById('magnifier-clone')
  if (!original || !clonedContainer) return

  // Deep clone original DOM
  const clone = original.cloneNode(true)

  // Replace resource-heavy / duplicate interactive elements with comment nodes.
  // Comments keep the childNodes index positions intact so attribute patches
  // below can address clone nodes by structural path.
  clone.querySelectorAll(STRIP_SELECTOR).forEach((el) => {
    el.replaceWith(document.createComment('stripped'))
  })

  // Remove duplicate IDs
  clone.removeAttribute('id')
  clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'))

  // The site's only fixed chrome is the header. It is re-anchored into the
  // clone's document coordinate space and offset by scrollY in handleScroll,
  // which reproduces viewport-fixed behaviour inside the lens. Other elements
  // keep their own positioning untouched.
  const header = clone.querySelector('header')
  if (header) {
    header.style.position = 'absolute'
    header.style.top = '0px'
    header.style.willChange = 'transform'
  }

  // Make clone completely inert
  clone.setAttribute('inert', '')

  clonedContainer.replaceChildren(clone)

  cloneRoot = clone
  clonedHeader = header
  // Clone generation changed — drop stale node/animation mappings.
  // Mirrors died with the previous clone subtree, so no disposal needed.
  cloneNodeCache = new WeakMap()
  animPairs = new Map()
  dirtyAnimEls = new Set()
  // The fresh clone already carries current attribute state
  pendingAttrPatches = new Map()
  collectStickyPairs(original, clonedContainer)
  handleScroll()
  adoptRunningAnimations()
  reapplyHoverChain()
}

// Layout-box top of `el` relative to `container`, walking the offsetParent
// chain. offsetTop is a layout value — unaffected by the lens transform — and
// the clone never sticks, so this yields the element's true flow position.
const offsetTopWithin = (el, container) => {
  let top = 0
  let node = el
  while (node && node !== container) {
    top += node.offsetTop
    node = node.offsetParent
  }
  return top
}

// Find every sticky element in the original and cache the geometry needed to
// re-derive its stuck offset from scrollY alone. Runs once per clone
// generation; the clone's own (never-stuck) layout supplies the flow
// positions, so a currently-stuck original can't poison the cache.
const collectStickyPairs = (original, clonedContainer) => {
  stickyPairs = []
  original.querySelectorAll('[class*="sticky"]').forEach((el) => {
    const cs = getComputedStyle(el)
    if (cs.position !== 'sticky') return
    const topOffset = parseFloat(cs.top)
    if (Number.isNaN(topOffset)) return

    const cloneEl = resolveCloneNode(el)
    const parent = cloneEl && cloneEl.parentElement
    if (!cloneEl || !parent) return

    const flowTop = offsetTopWithin(cloneEl, clonedContainer)
    const parentTop = offsetTopWithin(parent, clonedContainer)
    const maxDelta = Math.max(
      0,
      parentTop + parent.offsetHeight - cloneEl.offsetHeight - flowTop
    )

    cloneEl.style.willChange = 'transform'
    stickyPairs.push({ cloneEl, topOffset, flowTop, maxDelta, delta: 0 })
  })
}

const queueSyncDOM = () => {
  if (debounceTimeout) clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(syncDOM, 250)
}

// Structural path of a node relative to root, as childNodes indices
const nodePath = (el, root) => {
  const path = []
  let cur = el
  while (cur && cur !== root) {
    const parent = cur.parentNode
    if (!parent) return null
    path.push(Array.prototype.indexOf.call(parent.childNodes, cur))
    cur = parent
  }
  if (cur !== root) return null
  return path.reverse()
}

// Resolve the clone counterpart of an element inside #original-site.
// Cached per clone generation — path walking only happens once per element.
const resolveCloneNode = (target) => {
  if (!cloneRoot || !target || target.nodeType !== 1) return null

  const cached = cloneNodeCache.get(target)
  if (cached) return cached.isConnected ? cached : null

  const original = document.getElementById('original-site')
  if (!original) return null

  const path = nodePath(target, original)
  if (!path) return null

  let node = cloneRoot
  for (const index of path) {
    node = node.childNodes[index]
    if (!node) return null
  }
  if (node.nodeType !== 1 || node.tagName !== target.tagName) return null

  cloneNodeCache.set(target, node)
  return node
}

// Attribute mutations are queued, not applied, and flushed once per frame.
// Scroll-driven inline styles (header logo fade, yellow pill height, section
// track progress) fire several times per frame; coalescing collapses them to a
// single write per attribute, using the latest value, and skips the work
// entirely while the lens is hidden.
const queueAttrPatch = (target, attrName) => {
  let attrs = pendingAttrPatches.get(target)
  if (!attrs) {
    attrs = new Set()
    pendingAttrPatches.set(target, attrs)
  }
  attrs.add(attrName)
}

const flushAttrPatches = () => {
  if (!pendingAttrPatches.size) return

  const pending = pendingAttrPatches
  pendingAttrPatches = new Map()

  let failed = false
  for (const [target, attrs] of pending) {
    for (const attrName of attrs) {
      if (!patchAttribute(target, attrName)) failed = true
    }
  }
  // Anything unresolvable means the clone structure is out of date
  if (failed) queueSyncDOM()
}

// Apply one attribute onto the clone instead of re-cloning the whole page
const patchAttribute = (target, attrName) => {
  // Element removed before the flush — the pending reclone covers it
  if (!target.isConnected) return true

  const node = resolveCloneNode(target)
  if (!node) return false

  const value = target.getAttribute(attrName)
  if (value === null) {
    node.removeAttribute(attrName)
  } else {
    node.setAttribute(attrName, value)
  }

  // Header positioning override must survive a style-attribute overwrite
  if (attrName === 'style') applyCloneOverrides(node)

  return true
}

// ── CSS animation / transition synchronisation ────────────────────────────
// The clone must never run an animation of its own. CSS transitions and
// animations are switched off inside #magnifier-clone (see main.css), so a
// cloned element cannot start a second, independently-timed copy of the
// original's animation — the source of the overlap glitch on the Approach steps.
//
// The clone is instead driven by paused WAAPI mirrors, one per running source
// animation, built from that source's own resolved keyframes and timing and
// stepped by its currentTime. element.animate() is unaffected by the CSS
// `transition: none` / `animation: none` overrides, so the two coexist:
//
//   original CSSTransition / CSSAnimation   ← the single real animation
//                  │
//                  └── mirror.currentTime = source.currentTime
//
// Registration is push-based: bubbling transitionrun/animationstart events say
// exactly which element started animating, and the matching end/cancel events say
// when to tear the link down. The document is scanned once per clone generation
// and never on a timer.
//
// Per frame this costs one property read plus one property write per running
// animation. No getComputedStyle, no getAnimations, no getBoundingClientRect —
// nothing that forces style recalculation or layout.

// Build a paused mirror of an original animation on the clone element.
// getKeyframes() resolves the real from/to values (for a CSSTransition) or the
// @keyframes steps (for a CSSAnimation); getTiming() carries duration, easing,
// delay, direction and iteration count — including Infinity for the marquee.
const buildMirror = (source, cloneEl) => {
  try {
    const keyframes = source.effect.getKeyframes()
    if (!keyframes || keyframes.length < 2) return null

    const timing = source.effect.getTiming()
    const mirror = cloneEl.animate(keyframes, {
      duration: timing.duration,
      easing: timing.easing,
      delay: timing.delay,
      endDelay: timing.endDelay,
      iterations: timing.iterations,
      iterationStart: timing.iterationStart,
      direction: timing.direction,
      fill: 'both'
    })
    mirror.pause()
    return mirror
  } catch {
    return null
  }
}

// Refresh the links for ONE element. Scoped to that element's own animations —
// the document is never scanned here.
const refreshElement = (orig) => {
  if (!cloneRoot || !orig || !orig.isConnected) {
    dropElement(orig)
    return
  }

  const sources = typeof orig.getAnimations === 'function' ? orig.getAnimations() : []
  const existing = animPairs.get(orig)

  if (!sources.length) {
    dropElement(orig)
    return
  }

  const clone = existing ? existing.clone : resolveCloneNode(orig)
  if (!clone || !clone.isConnected) {
    dropElement(orig)
    return
  }

  // Make sure the clone's base state matches before a mirror is layered on top
  if (!existing) reassertCloneState(orig, clone)

  // Reuse live links so a mirror is never rebuilt mid-transition
  const reusable = new Map()
  if (existing) existing.links.forEach(link => reusable.set(link.source, link))

  const links = []

  for (const source of sources) {
    const kept = reusable.get(source)
    if (kept) {
      links.push(kept)
      reusable.delete(source)
      continue
    }

    // Transitions and keyframe animations are handled identically — the clone
    // never runs either kind itself.
    const mirror = buildMirror(source, clone)
    if (mirror) links.push({ source, target: mirror })
  }

  // Mirrors whose source animation is gone
  reusable.forEach(link => disposeLink(link))

  if (links.length) animPairs.set(orig, { clone, links })
  else dropElement(orig)
}

const dropElement = (orig) => {
  const pair = orig && animPairs.get(orig)
  if (!pair) return
  pair.links.forEach(link => disposeLink(link))
  // Once the mirror is gone the clone renders its plain class/style state, so
  // that state has to be correct — a dropped mutation would otherwise strand the
  // clone at the exact moment the mirror disappears. Transitions are off inside
  // the clone, so this settles instantly instead of animating.
  reassertCloneState(orig, pair.clone)
  animPairs.delete(orig)
}

// Cheap string compares, no style reads — only writes when actually divergent
const reassertCloneState = (orig, clone) => {
  if (!orig || !clone || !orig.isConnected || !clone.isConnected) return

  const origClass = orig.getAttribute('class')
  if ((clone.getAttribute('class') || '') !== (origClass || '')) {
    if (origClass === null) clone.removeAttribute('class')
    else clone.setAttribute('class', origClass)
  }

  const origStyle = orig.getAttribute('style')
  if ((clone.getAttribute('style') || '') !== (origStyle || '')) {
    if (origStyle === null) clone.removeAttribute('style')
    else clone.setAttribute('style', origStyle)
    applyCloneOverrides(clone)
  }
}

// Overrides the clone needs regardless of what the original's style says
const applyCloneOverrides = (clone) => {
  if (clone === clonedHeader) {
    clone.style.position = 'absolute'
    clone.style.top = '0px'
    clone.style.transform = `translate3d(0, ${scrollY.value}px, 0)`
    return
  }
  // A style patch on a sticky clone wipes the manual stuck offset — reapply it
  const pair = stickyPairs.find(p => p.cloneEl === clone)
  if (pair) {
    clone.style.willChange = 'transform'
    if (pair.delta > 0) {
      clone.style.transform = `translate3d(0, ${pair.delta}px, 0)`
    }
  }
}

// One document-wide scan per clone generation, to adopt animations that were
// already running before the clone existed (infinite marquees, hero scroll dot).
// Never called on a timer.
const adoptRunningAnimations = () => {
  if (!cloneRoot || typeof document.getAnimations !== 'function') return
  const original = document.getElementById('original-site')
  if (!original) return

  const targets = new Set()
  for (const animation of document.getAnimations()) {
    const target = animation.effect && animation.effect.target
    // Only elements inside the real site — the clone lives outside #original-site
    if (target && target.nodeType === 1 && original.contains(target)) targets.add(target)
  }
  targets.forEach(refreshElement)
}

const disposeLink = (link) => {
  try {
    // Every mirror is ours — cancelling drops the clone back to its static
    // class-derived state, which is the source's final state.
    link.target.cancel()
  } catch {
    // Animation already gone with its element
  }
}

// Registration is event-driven. transitionrun fires the moment a Vue class swap
// starts a transition — before its first rendered frame — and animationstart does
// the same for keyframes. Both bubble, so one listener on #original-site covers
// the whole page and nothing polls the document.
const markAnimationDirty = (e) => {
  const target = e.target
  if (target && target.nodeType === 1) dirtyAnimEls.add(target)
}

const processDirtyAnimEls = () => {
  if (!dirtyAnimEls.size) return
  const pending = dirtyAnimEls
  dirtyAnimEls = new Set()
  pending.forEach(refreshElement)
}

// Per-frame work: copy currentTime, nothing else.
const syncAnimations = () => {
  for (const [orig, pair] of animPairs) {
    let settled = false
    for (const link of pair.links) {
      const state = link.source.playState
      if (state === 'finished' || state === 'idle') {
        // Source done. transitionend/animationend queues the teardown; this is
        // the fallback for sources cancelled without an event.
        settled = true
        continue
      }
      try {
        if (link.target.playState !== 'paused') link.target.pause()
        const time = link.source.currentTime
        if (time !== null) link.target.currentTime = time
      } catch {
        settled = true
      }
    }
    if (settled) dirtyAnimEls.add(orig)
  }
}

const handleMutations = (records) => {
  let needsReclone = false

  for (const record of records) {
    if (record.type === 'childList') {
      // Structure moved: cached original→clone mappings were resolved against
      // the old child indices and can now point at the wrong node. Drop them so
      // every later patch re-walks and re-validates by tagName.
      cloneNodeCache = new WeakMap()
      needsReclone = true
      continue
    }
    // Attribute change: queue it. No DOM work happens in the observer callback,
    // which can run several times per frame under scroll-driven style churn.
    // Never break early — one bad record must not drop the rest of the batch.
    queueAttrPatch(record.target, record.attributeName)
  }

  if (needsReclone) queueSyncDOM()
}

// Event Handlers
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
  document.body.classList.add('custom-cursor-active')

  // Check hover over interactive elements
  const target = e.target
  if (target) {
    isOverHeader.value = !!target.closest(LENS_EXCLUDE_SELECTOR)
    // Hover state only matters while the lens actually shows the clone
    updateHoverChain(isOverHeader.value ? null : target)
    const interactiveEl = target.closest('a, button, [role="button"], input, textarea, select, .cursor-pointer, .interactive-cursor')
    if (interactiveEl) {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
        hoverTimeout = null
      }
      isHovering.value = true
      targetRadius.value = 42 // 84px diameter on hover
    } else {
      if (!hoverTimeout) {
        hoverTimeout = setTimeout(() => {
          isHovering.value = false
          targetRadius.value = 28 // 56px default diameter
          hoverTimeout = null
        }, 80)
      }
    }
  }

  // Reset idle timer
  if (idleTimeout) clearTimeout(idleTimeout)
  idleTimeout = setTimeout(() => {
    isVisible.value = false
    document.body.classList.remove('custom-cursor-active')
  }, 4000)
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
    document.body.classList.add('custom-cursor-active')
  }
}

const handleWindowBlur = () => {
  isVisible.value = false
  document.body.classList.remove('custom-cursor-active')
}

// Lerp calculation helper
const lerp = (start, end, factor) => start + (end - start) * factor

// Main Animation Loop (strictly mouse/radius lerp calculations)
const updateMagnifier = () => {
  if (!isMobile.value) {
    currentX.value = lerp(currentX.value, mouseX.value, 0.24)
    currentY.value = lerp(currentY.value, mouseY.value, 0.24)
    currentRadius.value = lerp(currentRadius.value, targetRadius.value, 0.12)

    // Clone upkeep only matters while the lens is on screen. Hidden, the queues
    // keep coalescing (deduped by element+attribute) and flush on the frame the
    // lens reappears.
    if (isVisible.value && hasMoved.value) {
      flushAttrPatches()
      processDirtyAnimEls()
      syncAnimations()
    }
  }
  rafId = requestAnimationFrame(updateMagnifier)
}

// Re-sync on route change without dangling timers
watch(
  () => route.fullPath,
  () => {
    if (isMobile.value) return
    handleScroll()
    nextTick(() => {
      // Route chunks can ship their own CSS — rescan for new :hover rules
      buildHoverStyles()
      syncDOM()
      // Single fallback for page content that resolves asynchronously
      // (lazy components, async data). Structural changes are otherwise
      // picked up by the MutationObserver.
      if (routeTimeout) clearTimeout(routeTimeout)
      routeTimeout = setTimeout(syncDOM, 400)
    })
  }
)

onMounted(() => {
  isMounted.value = true
  isMobile.value = checkMobile()

  if (!isMobile.value) {
    buildHoverStyles(true)
    syncDOM()

    // Observe original site mutations
    const original = document.getElementById('original-site')
    if (original) {
      observer = new MutationObserver(handleMutations)
      observer.observe(original, {
        childList: true,
        subtree: true,
        // All attributes, not just style/class — data-* and aria-* drive
        // selectors too (e.g. [data-nav-active]), and an unsynced attribute
        // means the clone renders a different state once a transition lock
        // is released. Patching an attribute is cheap; a stale one is not.
        attributes: true
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('mousedown', handleMouseDown, { passive: true })
    window.addEventListener('mouseup', handleMouseUp, { passive: true })
    window.addEventListener('blur', handleWindowBlur)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleResize, { passive: true })

    // Animation registration — bubbling CSS animation/transition events,
    // scoped to the real site so clone-side events never feed back in.
    if (original) {
      ANIM_EVENTS.forEach((type) => {
        original.addEventListener(type, markAnimationDirty, { passive: true })
      })
    }

    updateMagnifier()
  }
})

onBeforeUnmount(() => {
  if (rafId) {
    cancelAnimationFrame(rafId)
    rafId = null
  }
  if (observer) {
    observer.disconnect()
    observer = null
  }
  if (debounceTimeout) {
    clearTimeout(debounceTimeout)
    debounceTimeout = null
  }
  if (idleTimeout) {
    clearTimeout(idleTimeout)
    idleTimeout = null
  }
  if (hoverTimeout) {
    clearTimeout(hoverTimeout)
    hoverTimeout = null
  }
  if (routeTimeout) {
    clearTimeout(routeTimeout)
    routeTimeout = null
  }
  cloneRoot = null
  clonedHeader = null
  hoverChain = []
  lastHoverTarget = null
  hoverSheetSignature = ''
  if (hoverStyleEl) {
    hoverStyleEl.remove()
    hoverStyleEl = null
  }
  stickyPairs = []
  animPairs = new Map()
  dirtyAnimEls = new Set()
  pendingAttrPatches = new Map()
  cloneNodeCache = new WeakMap()

  if (typeof window !== 'undefined') {
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('mousedown', handleMouseDown)
    window.removeEventListener('mouseup', handleMouseUp)
    window.removeEventListener('blur', handleWindowBlur)
    document.removeEventListener('mouseleave', handleMouseLeave)
    document.removeEventListener('mouseenter', handleMouseEnter)
    window.removeEventListener('scroll', handleScroll)
    window.removeEventListener('resize', handleResize)

    const original = document.getElementById('original-site')
    if (original) {
      ANIM_EVENTS.forEach((type) => {
        original.removeEventListener(type, markAnimationDirty)
      })
    }

    document.body.classList.remove('custom-cursor-active')
  }
})

// Styles for target dot
const targetDotStyle = computed(() => {
  if (!isVisible.value || !hasMoved.value) return { display: 'none' }
  return {
    transform: `translate3d(-50%, -50%, 0) translate3d(${mouseX.value}px, ${mouseY.value}px, 0)`
  }
})

// Styles for outer lerped ring & magnifier container
const lensStyle = computed(() => {
  if (!isVisible.value || !hasMoved.value) {
    return { opacity: 0, pointerEvents: 'none' }
  }

  const r = currentRadius.value
  const posX = currentX.value - r
  const posY = currentY.value - r
  const diameter = r * 2
  const press = isPressed.value ? 0.85 : 1

  return {
    width: `${diameter}px`,
    height: `${diameter}px`,
    transform: `translate3d(${posX}px, ${posY}px, 0) scale(${press})`,
    opacity: 1,
    pointerEvents: 'none'
  }
})

// Transform for the DOM clone inside the lens. Over excluded regions the ring
// itself stays on screen — only the magnified content is dropped.
const cloneStyle = computed(() => {
  if (isOverHeader.value) return { opacity: 0, visibility: 'hidden' }

  const r = currentRadius.value
  const documentX = currentX.value + scrollX.value
  const documentY = currentY.value + scrollY.value

  const translateX = r - documentX * ZOOM
  const translateY = r - documentY * ZOOM

  return {
    transform: `translate3d(${translateX}px, ${translateY}px, 0) scale(${ZOOM})`,
    transformOrigin: '0 0',
    willChange: 'transform'
  }
})
</script>

<template>
  <div
    v-if="isMounted && !isMobile"
    class="magnifier-wrapper"
    aria-hidden="true"
  >
    <!-- Magnifying Glass Lens with Ring Styling -->
    <div
      class="magnifier-lens custom-cursor-dot-lerp"
      :class="{ 'is-interactive': isHovering, 'is-pressed': isPressed }"
      :style="lensStyle"
    >
      <div
        id="magnifier-clone"
        :style="cloneStyle"
      />
    </div>

    <!-- Precision Target Dot at exact mouse location -->
    <div
      class="custom-cursor-dot-target"
      :style="targetDotStyle"
    />
  </div>
</template>
