import type { ResolvedFeaturedProject } from '~/types/featured-project'
import { projects as localProjects } from '~/data/portfolio'

/**
 * Maps local portfolio projects to the ResolvedFeaturedProject shape
 * so the UI always receives a consistent interface.
 */
function mapLocalProjects(): ResolvedFeaturedProject[] {
  return localProjects.map((p, i) => ({
    id: i + 1,
    title: p.title,
    slug: p.slug,
    category: p.subtitle,
    image_path: p.image,
    image_url: p.image,
    description: p.story,
    display_order: i + 1,
    featured: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }))
}

/**
 * Returns featured projects for the Featured Work section.
 *
 * Currently reads from local `data/portfolio.ts`.
 *
 * ── FUTURE: Supabase Integration ─────────────────────────────────
 * When ready to connect Supabase, install `@nuxtjs/supabase` and
 * replace the body of this composable with:
 *
 * ```ts
 * const supabase = useSupabaseClient()
 * const { data, pending, error } = await useAsyncData('featured-projects', async () => {
 *   const { data: rows, error: fetchError } = await supabase
 *     .from('featured_projects')
 *     .select('*')
 *     .eq('featured', true)
 *     .order('display_order', { ascending: true })
 *   if (fetchError) throw new Error(fetchError.message)
 *   return rows.map(row => ({
 *     ...row,
 *     image_url: supabase.storage.from('project-images').getPublicUrl(row.image_path).data.publicUrl
 *   }))
 * })
 * ```
 * ──────────────────────────────────────────────────────────────────
 */
export function useFeaturedProjects() {
  return {
    projects: ref<ResolvedFeaturedProject[]>(mapLocalProjects()),
    pending: ref(false),
    error: ref<Error | null>(null)
  }
}
