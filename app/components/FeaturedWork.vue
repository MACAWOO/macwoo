<script setup lang="ts">
const { projects, pending } = useFeaturedProjects()
</script>

<template>
  <section class="py-16 md:py-20 bg-[#1D96B8]">
    <div class="max-w-[1201px] mx-auto px-6 md:px-8">
      <!-- ── Header ── -->
      <div class="text-center max-w-[700px] mx-auto mb-14 md:mb-16">
        <h2
          class="text-[#E8F600] text-[36px] md:text-[48px] leading-[1.15] font-medium mb-4"
          style="font-family: 'Fredoka', sans-serif;"
        >
          Featured Work
        </h2>
        <p
          class="text-white/90 text-[13px] md:text-[14.5px] leading-[1.65] font-normal"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          A curated collection of our most impactful projects where strategy meets creativity. Each work reflects how we transform ideas into powerful brand experiences, combining design, storytelling, and marketing to deliver real results.
        </p>
      </div>

      <!-- ── Loading skeleton ── -->
      <div
        v-if="pending"
        class="flex flex-col md:flex-row md:flex-wrap gap-y-8 md:gap-x-[28px]"
      >
        <div
          v-for="i in 4"
          :key="i"
          :class="[
            'animate-pulse w-full',
            (i - 1) % 4 === 0 || (i - 1) % 4 === 3
              ? 'md:w-[calc((100%-28px)*0.5459)]'
              : 'md:w-[calc((100%-28px)*0.4541)]'
          ]"
        >
          <div
            class="rounded-[16px] w-full bg-white/15"
            :class="(i - 1) % 4 === 0 || (i - 1) % 4 === 3 ? 'aspect-[680/662]' : 'aspect-[470/550]'"
          />
          <div class="mt-3 space-y-2">
            <div class="h-7 w-40 bg-white/15 rounded" />
            <div class="h-8 w-52 bg-white/10 rounded-full" />
          </div>
        </div>
      </div>

      <!-- ── Project grid ── -->
      <div
        v-else
        class="flex flex-col md:flex-row md:flex-wrap gap-y-10 md:gap-x-[28px]"
      >
        <FeaturedWorkCard
          v-for="(project, index) in projects"
          :key="project.id"
          :project="project"
          :is-large="index % 4 === 0 || index % 4 === 3"
          :class="[
            'w-full',
            index % 4 === 0 || index % 4 === 3
              ? 'md:w-[calc((100%-28px)*0.5459)]'
              : 'md:w-[calc((100%-28px)*0.4541)]'
          ]"
        />
      </div>

      <!-- ── CTA Button ── -->
      <div class="mt-14 md:mt-16">
        <NuxtLink
          to="/portfolio"
          class="group/btn w-full flex items-center justify-center gap-2.5 py-4 bg-[#E8F600] hover:bg-[#dce400] text-black text-[15px] md:text-[16px] font-bold rounded-full transition-all duration-300 ease-out hover:-translate-y-[1px]"
          style="font-family: 'Bricolage Grotesque', sans-serif;"
        >
          <span>View All Projects</span>
          <UpRightArrow
            class="w-[13px] h-[13px] shrink-0 transition-transform duration-300 ease-out group-hover/btn:translate-x-[1px] group-hover/btn:-translate-y-[1px]"
          />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>
