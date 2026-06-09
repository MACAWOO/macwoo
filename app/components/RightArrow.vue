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
    viewBox="0 0 29 29"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M0.0493275 12.3577L1.15143e-05 16.3103L18.7543 16.404C14.4844 19.0257 11.9054 23.665 11.1255 28.8948L15.2674 28.9373C16.2099 21.9489 21.3252 16.2872 28.6084 16.3604L28.6514 12.8844C21.3681 12.8113 16.3944 7.04865 15.6236 0.041087L11.4832 6.28602e-06C12.1329 5.24274 14.5984 9.93401 18.7996 12.643L0.0493275 12.3577Z"
      :fill="fill"
    />
  </svg>
</template>
