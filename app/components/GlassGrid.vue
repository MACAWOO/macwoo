<script setup lang="ts">
interface Props {
  grids?: number
}

withDefaults(defineProps<Props>(), {
  grids: 53
})
</script>

<template>
  <div class="absolute inset-0 pointer-events-none overflow-hidden select-none z-[4]">
    <!-- Single Backdrop Blur Overlay for high-performance scrolling -->
    <div
      class="absolute inset-0 pointer-events-none z-[4]"
      style="backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px);"
      aria-hidden="true"
    />

    <!-- Premium Glass Panel Overlay -->
    <div
      class="absolute inset-0 pointer-events-none z-[5] flex items-center justify-start overflow-hidden w-full h-full"
      aria-hidden="true"
    >
      <div
        v-for="i in grids"
        :key="i"
        class="glass-panel"
        :style="{
          '--panel-index': i,
          'width': `calc(100% / ${grids})`,
          'flex': `0 0 calc(100% / ${grids})`
        }"
      >
        <svg
          class="glass-svg"
          width="29"
          height="386"
          viewBox="0 0 29 386"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <rect
            y="-96"
            width="29"
            height="519"
            fill="#1E1E1E"
            fill-opacity="0.2"
          />
        </svg>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ── Premium Glassmorphism Vertical Panels ── */
.glass-panel {
  position: relative;
  display: block !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
  border: none !important;
  outline: none !important;
  box-sizing: border-box !important;
  overflow: hidden;
  pointer-events: none; /* Let all mouse events pass through to content */
}

/* Sub-pixel SVG styling to fit perfectly inside the column wrapper */
.glass-svg {
  position: absolute;
  inset: 0;
  width: 100% !important;
  height: 100% !important;
  display: block;
  z-index: 1;
  pointer-events: none;
}

/* Alternating gradients to create realistic refractive depth between side-by-side sheets */
.glass-panel:nth-child(odd) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.12) 0%,
    rgba(255, 255, 255, 0.02) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.18), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.4);         /* Shadow cast to the right */
}

.glass-panel:nth-child(even) {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.01) 12%,
    transparent 35%,
    transparent 100%
  );
  /* Glass bevel shadows and reflective highlights */
  box-shadow:
    1.5px 0 0 rgba(255, 255, 255, 0.14), /* Reflective white shadow/highlight on the right */
    4px 0 8px rgba(0, 0, 0, 0.35);        /* Shadow cast to the right */
}

/* Left edge reflection — sharp vertical specular highlight */
.glass-panel::before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 1px;
  background: linear-gradient(
    180deg,
    rgba(255, 255, 255, 0.02) 0%,
    rgba(255, 255, 255, 0.30) 25%,
    rgba(255, 255, 255, 0.45) 50%,
    rgba(255, 255, 255, 0.30) 75%,
    rgba(255, 255, 255, 0.02) 100%
  );
  pointer-events: none;
  z-index: 2;
}
</style>
