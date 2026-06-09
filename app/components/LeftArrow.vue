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
      d="M28.6021 12.3577L28.6514 16.3103L9.89715 16.404C14.167 19.0257 16.746 23.665 17.5259 28.8948L13.384 28.9373C12.4415 21.9489 7.32619 16.2872 0.0429504 16.3604L6.76632e-06 12.8844C7.28325 12.8113 12.257 7.04865 13.0278 0.041087L17.1682 6.28602e-06C16.5185 5.24274 14.053 9.93401 9.85184 12.643L28.6021 12.3577Z"
      :fill="fill"
    />
  </svg>
</template>
