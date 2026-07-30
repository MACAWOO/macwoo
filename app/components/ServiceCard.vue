<script setup lang="ts">
interface Props {
  icon: string
  title: string
  description: string
  to?: string
}

defineProps<Props>()
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'div'"
    :to="to"
    class="bg-white rounded-2xl p-6 flex flex-col gap-4 hover:shadow-lg transition-shadow"
  >
    <NuxtImg
      :src="icon"
      :alt="title"
      class="w-10 h-10 object-contain"
      format="webp"
      loading="lazy"
      width="40"
      height="40"
    />
    <h3 class="text-brand-teal-500 font-bold text-lg leading-snug">
      {{ title }}
    </h3>
    <p class="text-zinc-600 text-sm leading-relaxed">
      {{ description }}
    </p>
  </component>
</template>
