<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{
  theme?: 'light' | 'dark' | 'auto'
  size?: 'normal' | 'compact' | 'invisible'
}>()

const emit = defineEmits<{
  (e: 'verify', token: string): void
  (e: 'expire'): void
  (e: 'error'): void
}>()

const container = ref<HTMLElement | null>(null)
let widgetId: string | null = null

const config = useRuntimeConfig()
const siteKey = config.public.turnstileSiteKey || '1x00000000000000000000AA'

const initializeTurnstile = () => {
  if (!container.value || !(window as any).turnstile) return

  try {
    widgetId = (window as any).turnstile.render(container.value, {
      sitekey: siteKey,
      theme: props.theme || 'auto',
      size: props.size || 'invisible',
      callback: (token: string) => {
        emit('verify', token)
      },
      'expired-callback': () => {
        emit('expire')
      },
      'error-callback': () => {
        emit('error')
      }
    })
  } catch (err) {
    console.error('Error rendering Turnstile:', err)
  }
}

const reset = () => {
  if (widgetId && (window as any).turnstile) {
    (window as any).turnstile.reset(widgetId)
  }
}

defineExpose({
  reset
})

onMounted(() => {
  if (!document.getElementById('cloudflare-turnstile-script')) {
    const script = document.createElement('script')
    script.id = 'cloudflare-turnstile-script'
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
    script.async = true
    script.defer = true
    document.head.appendChild(script)
  }

  const checkInterval = setInterval(() => {
    if ((window as any).turnstile) {
      clearInterval(checkInterval)
      initializeTurnstile()
    }
  }, 100)

  onUnmounted(() => {
    clearInterval(checkInterval)
    if (widgetId && (window as any).turnstile) {
      (window as any).turnstile.remove(widgetId)
    }
  })
})
</script>

<template>
  <div
    ref="container"
    class="turnstile-widget"
    :class="{ 'is-invisible': (props.size || 'invisible') === 'invisible' }"
  />
</template>

<style scoped>
.turnstile-widget:not(.is-invisible) {
  min-height: 65px;
}
</style>
