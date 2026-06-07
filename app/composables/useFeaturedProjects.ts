import type { ResolvedFeaturedProject } from '~/types/featured-project'

export function useFeaturedProjects() {
  const { projects } = usePortfolio()

  const featuredProjects = computed<ResolvedFeaturedProject[]>(() => {
    return projects.value
      .filter(p => p.featured !== false)
      .map((p, i) => ({
        id: i + 1,
        title: p.title,
        slug: p.slug,
        category: p.subtitle,
        image_path: p.image,
        image_url: p.image,
        description: p.story,
        display_order: p.displayOrder ?? (i + 1),
        featured: p.featured !== false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }))
      .sort((a, b) => a.display_order - b.display_order)
  })

  return {
    projects: featuredProjects,
    pending: ref(false),
    error: ref<Error | null>(null)
  }
}

