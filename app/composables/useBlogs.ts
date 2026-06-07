import { posts as defaultPosts } from '~/data/blog'
import type { BlogPost } from '~/data/blog'

export function useBlogs() {
  const posts = useState<BlogPost[]>('blogs', () => defaultPosts)

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_blogs')
    if (stored) {
      try {
        posts.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing blogs from localStorage:', e)
      }
    }
  })

  // Watch and save on client side
  if (import.meta.client) {
    watch(posts, (newPosts) => {
      localStorage.setItem('macwoo_blogs', JSON.stringify(newPosts))
    }, { deep: true })
  }

  const addPost = (post: BlogPost) => {
    posts.value.unshift(post)
  }

  const updatePost = (slug: string, updated: BlogPost) => {
    const idx = posts.value.findIndex(p => p.slug === slug)
    if (idx !== -1) {
      // Replaces the element to ensure reactivity triggers properly
      posts.value.splice(idx, 1, updated)
    }
  }

  const deletePost = (slug: string) => {
    posts.value = posts.value.filter(p => p.slug !== slug)
  }

  const resetBlogs = () => {
    posts.value = JSON.parse(JSON.stringify(defaultPosts))
    localStorage.removeItem('macwoo_blogs')
  }

  return {
    posts,
    addPost,
    updatePost,
    deletePost,
    resetBlogs
  }
}
