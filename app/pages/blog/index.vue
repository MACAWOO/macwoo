<script setup lang="ts">
const { posts } = useBlogs()

useSeoMeta({
  title: 'Blog — Macawoo',
  description: 'Ideas, insights & stories that drive brands. The Macawoo journal on branding, marketing, and creative strategy.'
})

const POSTS_PER_PAGE = 6
const currentPage = ref(1)
const totalPages = computed(() => Math.ceil(posts.value.length / POSTS_PER_PAGE))
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * POSTS_PER_PAGE
  return posts.value.slice(start, start + POSTS_PER_PAGE)
})

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()
}
</script>

<template>
  <div>
    <PageHero
      variant="teal"
      title-html="Ideas, Insights &amp; Stories<br>That Drive Brands"
      video="/Background%20Videos/Blog.mp4"
      class="custom-hero-ratio"
      show-grid
    />

    <section class="bg-[#1d96b8] py-16 pb-20">
      <div class="max-w-[1440px] mx-auto px-[120px]">
        <h2 class="font-fredoka font-medium text-[48px] text-[#f4ed18] leading-[51px] mb-12">
          Latest Articles
        </h2>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="post in paginatedPosts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="group block rounded-[34px] overflow-hidden"
          >
            <div class="h-[337px] overflow-hidden rounded-t-[34px] bg-zinc-200">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
            </div>
            <div class="bg-white rounded-b-[34px] px-[21px] pt-[14px] pb-[18px] flex flex-col gap-[10px]">
              <div class="flex gap-2 flex-wrap">
                <span class="border border-[#201f1f] rounded-full px-[9px] py-[3px] text-[16px] text-[#201f1f] leading-[28px] whitespace-nowrap">
                  {{ formatDate(post.date) }}
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
                  {{ post.readTime }}
                </span>
              </div>
              <h3 class="text-[32px] font-normal text-[#201f1f] leading-tight">
                {{ post.title }}
              </h3>
            </div>
          </NuxtLink>
        </div>

        <div
          v-if="totalPages > 1"
          class="flex items-center justify-end gap-[10px] mt-14"
        >
          <button
            :disabled="currentPage === 1"
            class="w-[41px] h-[41px] rounded-full border border-white flex items-center justify-center text-white disabled:opacity-40 hover:bg-white/10 transition-colors"
            @click="currentPage = Math.max(1, currentPage - 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M9 2L4 7L9 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
          <span class="text-[18px] font-medium text-white whitespace-nowrap">
            Page: {{ String(currentPage).padStart(2, '0') }}
          </span>
          <button
            :disabled="currentPage === totalPages"
            class="w-[41px] h-[41px] rounded-full border border-white flex items-center justify-center text-white disabled:opacity-40 hover:bg-white/10 transition-colors"
            @click="currentPage = Math.min(totalPages, currentPage + 1)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                d="M5 2L10 7L5 12"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
