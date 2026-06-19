<script setup lang="ts">
interface Props {
  fill?: string
}

withDefaults(defineProps<Props>(), {
  fill: '#141111'
})
</script>

<template>
  <svg
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M7.79309 -1.78076e-05L5.90884 0.0123462L6.01417 8.95338C4.73051 6.94174 2.49873 5.75442 -7.27803e-05 5.43009L0.0127927 7.40495C3.35106 7.79079 6.09039 10.1779 6.11377 13.6505L7.7708 13.6394C7.74741 10.1668 10.4541 7.74354 13.7878 7.31251L13.7743 5.33839C11.2808 5.69566 9.06459 6.91357 7.80708 8.94085L7.79309 -1.78076e-05Z"
      :fill="fill"
    />
  </svg>
</template>
