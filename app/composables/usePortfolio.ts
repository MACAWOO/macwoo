/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSupabase } from './useSupabase'
import { projects as defaultProjects } from '~/data/portfolio'
import type { PortfolioProject } from '~/data/portfolio'

export interface AdminPortfolioProject extends PortfolioProject {
  featured?: boolean
  displayOrder?: number
}

const initialProjects: AdminPortfolioProject[] = defaultProjects.map((p, i) => ({
  ...p,
  featured: true,
  displayOrder: i + 1
}))

export function usePortfolio() {
  const supabase = useSupabase()
  const projects = useState<AdminPortfolioProject[]>('portfolio', () => [])

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase
        .from('portfolio_projects')
        .select('*, categories(name)')
        .order('sort_order', { ascending: true })

      if (error) throw error
      if (data) {
        projects.value = data.map((d: any) => ({
          slug: d.slug,
          title: d.title,
          subtitle: d.subtitle,
          tags: d.tags || [],
          category: d.categories?.name || 'Branding',
          image: d.image,
          heroImage: d.hero_image,
          galleryImages: d.gallery_images || [],
          story: d.story || '',
          tagline: d.tagline || undefined,
          services: d.services || undefined,
          industry: d.industry || undefined,
          date: d.date || undefined,
          storyParagraphs: d.story_paragraphs || [],
          featured: true,
          displayOrder: d.sort_order
        }))
      }
    } catch (e) {
      console.error('Error fetching portfolio projects:', e)
    }
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || projects.value.length === 0) {
    fetchPromise = fetchProjects()
  }

  const resolveCategoryId = async (categoryName: string): Promise<string | null> => {
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .limit(1)
      .maybeSingle()
    return data?.id || null
  }

  const addProject = async (project: AdminPortfolioProject) => {
    const categoryId = await resolveCategoryId(project.category)
    const payload = {
      slug: project.slug,
      title: project.title,
      subtitle: project.subtitle,
      tags: project.tags,
      category_id: categoryId,
      image: project.image,
      hero_image: project.heroImage,
      gallery_images: project.galleryImages,
      story: project.story,
      tagline: project.tagline || null,
      services: project.services || null,
      industry: project.industry || null,
      date: project.date || null,
      story_paragraphs: project.storyParagraphs || [],
      sort_order: project.displayOrder || (projects.value.length + 1),
      published: true
    }

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .insert(payload)
      if (error) throw error
      projects.value.push(project)
    } catch (e) {
      console.error('Error adding project:', e)
    }
  }

  const updateProject = async (slug: string, updated: AdminPortfolioProject) => {
    const categoryId = await resolveCategoryId(updated.category)
    const payload = {
      slug: updated.slug,
      title: updated.title,
      subtitle: updated.subtitle,
      tags: updated.tags,
      category_id: categoryId,
      image: updated.image,
      hero_image: updated.heroImage,
      gallery_images: updated.galleryImages,
      story: updated.story,
      tagline: updated.tagline || null,
      services: updated.services || null,
      industry: updated.industry || null,
      date: updated.date || null,
      story_paragraphs: updated.storyParagraphs || [],
      sort_order: updated.displayOrder || 1,
      published: true
    }

    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .update(payload)
        .eq('slug', slug)
      if (error) throw error

      const idx = projects.value.findIndex(p => p.slug === slug)
      if (idx !== -1) {
        projects.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating project:', e)
    }
  }

  const deleteProject = async (slug: string) => {
    try {
      const { error } = await supabase
        .from('portfolio_projects')
        .delete()
        .eq('slug', slug)
      if (error) throw error
      projects.value = projects.value.filter(p => p.slug !== slug)
    } catch (e) {
      console.error('Error deleting project:', e)
    }
  }

  const resetPortfolio = async () => {
    try {
      await supabase.from('portfolio_projects').delete().neq('slug', 'doesnotexist')
      const { data: cats } = await supabase.from('categories').select('*')
      const catMap = new Map<string, string>(cats?.map((c: any) => [c.name.toLowerCase(), c.id]) || [])

      const payloads = initialProjects.map((p, i) => ({
        slug: p.slug,
        title: p.title,
        subtitle: p.subtitle,
        tags: p.tags,
        category_id: catMap.get(p.category.toLowerCase()) || null,
        image: p.image,
        hero_image: p.heroImage,
        gallery_images: p.galleryImages,
        story: p.story,
        tagline: p.tagline || null,
        services: p.services || null,
        industry: p.industry || null,
        date: p.date || null,
        story_paragraphs: p.storyParagraphs || [],
        sort_order: i + 1,
        published: true
      }))

      const { error } = await supabase
        .from('portfolio_projects')
        .insert(payloads)
      if (error) throw error

      projects.value = JSON.parse(JSON.stringify(initialProjects))
    } catch (e) {
      console.error('Error resetting portfolio:', e)
    }
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetPortfolio,
    fetchProjects,
    fetchPromise
  }
}
