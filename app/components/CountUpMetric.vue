<script setup lang="ts">
const props = defineProps<{
  value: string
  duration?: number
}>()

// Split metric string into prefix (e.g. "+", "₹"), numeric part, suffix (e.g. "%", "x", "K", "L+")
const parsed = computed(() => {
  const match = props.value.match(/^([^\d.]*)([\d.,]+)(.*)$/)
  if (!match) return { prefix: '', target: 0, decimals: 0, suffix: props.value }
  const prefix = match[1] || ''
  const numStr = match[2] || '0'
  const suffix = match[3] || ''
  const clean = numStr.replace(/,/g, '')
  const parts = clean.split('.')
  const decimals = parts.length > 1 && parts[1] ? parts[1].length : 0
  return { prefix, target: parseFloat(clean), decimals, suffix }
})

const display = ref(formatNum(0))
const el = ref<HTMLElement | null>(null)
let started = false

function formatNum(n: number) {
  const { decimals } = parsed.value
  return n.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

function animate() {
  if (started) return
  started = true
  const { target } = parsed.value
  const duration = props.duration ?? 1800
  let startTs: number | null = null

  const step = (ts: number) => {
    if (startTs === null) startTs = ts
    const progress = Math.min((ts - startTs) / duration, 1)
    // easeOutExpo
    const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
    display.value = formatNum(target * eased)
    if (progress < 1) requestAnimationFrame(step)
    else display.value = formatNum(target)
  }
  requestAnimationFrame(step)
}

onMounted(() => {
  if (!el.value) return
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animate()
        observer.unobserve(entry.target)
      }
    })
  }, { threshold: 0.4 })
  observer.observe(el.value)
})
</script>

<template>
  <span ref="el">{{ parsed.prefix }}{{ display }}{{ parsed.suffix }}</span>
</template>
