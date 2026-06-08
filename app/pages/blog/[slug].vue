<script setup lang="ts">
const { posts } = useBlogs()

const route = useRoute()
const slug = route.params.slug as string
const post = computed(() => posts.value.find(p => p.slug === slug))

if (!post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found', fatal: true })
}

useSeoMeta({
  title: () => post.value ? `${post.value.title} — Macawoo Blog` : 'Macawoo Blog',
  description: () => post.value ? post.value.excerpt : ''
})

const recommended = computed(() => posts.value.filter(p => p.slug !== slug).slice(0, 3))
</script>

<template>
  <div v-if="post">
    <!-- Back -->
    <div class="pt-20 pb-4 px-6 max-w-4xl mx-auto">
      <NuxtLink
        to="/blog"
        class="inline-flex items-center gap-2 text-zinc-500 text-sm hover:text-brand-teal-500 transition-colors"
      >
        ← Back
      </NuxtLink>
    </div>

    <!-- Hero image -->
    <div class="w-full aspect-[21/9] overflow-hidden">
      <img
        :src="post.image"
        :alt="post.title"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- Article -->
    <article class="py-14 bg-white">
      <div class="max-w-3xl mx-auto px-6">
        <div class="flex gap-3 mb-6">
          <span class="text-xs text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">
            {{ new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
          </span>
          <span class="text-xs text-zinc-500 bg-zinc-100 px-3 py-1.5 rounded-full">{{ post.readTime }}</span>
        </div>

        <h1 class="text-3xl md:text-5xl font-bold text-brand-yellow-500 leading-tight mb-6">
          {{ post.title }}
        </h1>

        <p class="text-zinc-500 text-base leading-relaxed mb-10 italic">
          {{ post.excerpt }}
        </p>

        <div
          v-for="section in post.body"
          :key="section.heading ?? section.content"
          class="mb-10"
        >
          <h2
            v-if="section.heading"
            class="text-xl font-bold text-brand-dark mb-4"
          >
            {{ section.heading }}
          </h2>
          <p class="text-zinc-700 text-base leading-relaxed">
            {{ section.content }}
          </p>
        </div>
      </div>
    </article>

    <!-- Recommended -->
    <section class="py-16 bg-brand-teal-500">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-2xl font-bold text-white mb-8">
          Recommended Reading
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <NuxtLink
            v-for="rec in recommended"
            :key="rec.slug"
            :to="`/blog/${rec.slug}`"
            class="group block bg-white rounded-2xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <div class="aspect-[4/3] overflow-hidden">
              <img
                :src="rec.image"
                :alt="rec.title"
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              >
            </div>
            <div class="p-4">
              <div class="flex gap-2 mb-2">
                <span class="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{{ new Date(rec.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
                <span class="text-xs text-zinc-400 bg-zinc-100 px-2 py-1 rounded">{{ rec.readTime }}</span>
              </div>
              <h3 class="font-bold text-brand-dark text-sm leading-snug">{{ rec.title }}</h3>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>
  </div>
</template>
