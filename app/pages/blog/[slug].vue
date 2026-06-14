<script setup lang="ts">
const { posts, fetchPromise } = useBlogs()
if (fetchPromise) {
  await fetchPromise
}

const route = useRoute()
const slug = route.params.slug as string
const post = computed(() => posts.value.find(p => p.slug === slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: () => post.value ? `${post.value.title} — Macawoo Blog` : 'Macawoo Blog',
  description: () => post.value ? post.value.excerpt : '',
  ogTitle: () => post.value ? `${post.value.title} — Macawoo Blog` : 'Macawoo Blog',
  ogDescription: () => post.value ? post.value.excerpt : '',
  ogType: 'article',
  ogImage: () => post.value?.image || '/og-image.png'
})

const recommended = computed(() => posts.value.filter(p => p.slug !== slug).slice(0, 3))

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}
</script>

<template>
  <div v-if="post">
    <!-- Hero image -->
    <div class="relative w-full h-[500px] md:h-[698px] overflow-hidden">
      <NuxtImg
        :src="post.image"
        :alt="post.title"
        preload
        format="webp"
        class="w-full h-full object-cover"
      />
      <div class="absolute inset-0 bg-black/20" />
      <NuxtLink
        to="/blog"
        class="absolute top-[90px] left-[120px] bg-white flex items-center gap-[3px] px-5 py-[10px] rounded-full font-extrabold text-[16px] text-[#201f1f] leading-[28px] hover:bg-zinc-100 transition-colors z-10"
      >
        <svg
          class="w-[14px] h-[14px] shrink-0 -rotate-45"
          viewBox="0 0 14 14"
          fill="none"
        >
          <path
            d="M2 12L12 2M12 2H4M12 2V10"
            stroke="currentColor"
            stroke-width="1.8"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        Back
      </NuxtLink>
    </div>

    <!-- Article header on teal -->
    <div class="bg-[#1d96b8]">
      <div class="max-w-[1440px] mx-auto px-[120px] pt-[59px] pb-[40px]">
        <div class="max-w-[894px]">
          <div class="flex gap-[15px] mb-[13px]">
            <span class="border border-white rounded-full px-[9px] py-[5px] text-[16px] font-['Bricolage_Grotesque'] text-white leading-[28px] whitespace-nowrap">
              {{ formatDate(post.date) }}
            </span>
            <span class="border border-white rounded-full px-[9px] py-[5px] text-[16px] font-['Bricolage_Grotesque'] text-white leading-[28px] flex items-center gap-[5px] whitespace-nowrap">
              <svg
                class="w-[18px] h-[18px] shrink-0"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="1.5"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="9"
                />
                <path
                  d="M12 7v5l3 3"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              {{ post.readTime }}
            </span>
          </div>
          <h1 class="font-fredoka font-medium text-[48px] text-[#f4ed18] leading-[51px] mb-[14px]">
            {{ post.title }}
          </h1>
          <p class="text-[18px] font-['Bricolage_Grotesque'] font-normal text-white leading-relaxed">
            {{ post.excerpt }}
          </p>
        </div>
      </div>
    </div>

    <!-- Article body (white) -->
    <article class="bg-white">
      <div class="max-w-[1440px] mx-auto px-[120px] py-[34px]">
        <div class="flex flex-col gap-[34px]">
          <div
            v-for="section in post.body"
            :key="section.heading ?? section.content"
            class="flex flex-col gap-[14px]"
          >
            <h2
              v-if="section.heading"
              class="font-fredoka font-medium text-[32px] text-[#1d96b8] leading-normal"
            >
              {{ section.heading }}
            </h2>
            <p class="text-[18px] font-['Bricolage_Grotesque'] font-normal text-black leading-relaxed">
              {{ section.content }}
            </p>
          </div>
        </div>
      </div>
    </article>

    <!-- Recommended reading -->
    <section class="bg-[#1d96b8] py-16">
      <div class="max-w-[1440px] mx-auto px-[120px]">
        <h2 class="font-fredoka font-medium text-[48px] text-[#f4ed18] leading-[51px] mb-8">
          Recommended Reading
        </h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="rec in recommended"
            :key="rec.slug"
            :to="`/blog/${rec.slug}`"
            class="group block rounded-[34px] overflow-hidden"
          >
            <div class="h-[337px] overflow-hidden rounded-t-[34px] bg-zinc-200">
              <NuxtImg
                :src="rec.image"
                :alt="rec.title"
                loading="lazy"
                format="webp"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            <div class="bg-white rounded-b-[34px] px-[21px] pt-[14px] pb-[18px] flex flex-col gap-[10px]">
              <div class="flex gap-2 flex-wrap">
                <span class="border border-[#201f1f] rounded-full px-[9px] py-[3px] text-[16px] text-[#201f1f] leading-[28px] whitespace-nowrap">
                  {{ formatDate(rec.date) }}
                </span>
                <span class="border border-[#201f1f] rounded-full px-[9px] py-[3px] text-[16px] text-[#201f1f] leading-[28px] flex items-center gap-[5px] whitespace-nowrap">
                  <svg
                    class="w-[18px] h-[18px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="1.5"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                    />
                    <path
                      d="M12 7v5l3 3"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{ rec.readTime }}
                </span>
              </div>
              <h3 class="text-[32px] font-normal text-[#201f1f] leading-tight">
                {{ rec.title }}
              </h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
