<script setup lang="ts">
import { posts } from '~/data/blog'

useSeoMeta({
  title: 'Blog — Macawoo',
  description: 'Ideas, insights & stories that drive brands. The Macawoo journal on branding, marketing, and creative strategy.'
})
</script>

<template>
  <div>
    <PageHero
      variant="teal"
      title-html="Ideas, Insights &amp; Stories<br>That Drive Brands"
      video="/Background%20Videos/Blog.mp4"
      image="/Images/Digital%20Marketing.jpeg"
    />

    <section class="py-16 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-brand-dark mb-10">
          Latest Articles
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="post in posts"
            :key="post.slug"
            :to="`/blog/${post.slug}`"
            class="group block bg-white rounded-2xl overflow-hidden border border-zinc-100 hover:shadow-lg transition-shadow"
          >
            <div class="aspect-[4/3] overflow-hidden bg-zinc-100">
              <img
                :src="post.image"
                :alt="post.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
            </div>
            <div class="p-5">
              <div class="flex gap-3 mb-3">
                <span class="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                <span class="text-xs text-zinc-500 bg-zinc-100 px-2 py-1 rounded">{{ post.readTime }}</span>
              </div>
              <h3 class="font-bold text-brand-dark text-base leading-snug group-hover:text-brand-teal-500 transition-colors">{{ post.title }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
