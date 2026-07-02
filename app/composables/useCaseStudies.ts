/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSupabase } from './useSupabase'
import { caseStudies as defaultCaseStudies } from '~/data/case-studies'
import type { CaseStudy } from '~/data/case-studies'

let cachedCaseStudies: CaseStudy[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useCaseStudies() {
  const supabase = useSupabase()
  const caseStudies = useState<CaseStudy[]>('caseStudies', () => [])

  const fetchCaseStudies = async () => {
    if (cachedCaseStudies && (Date.now() - cacheTime < CACHE_TTL)) {
      caseStudies.value = cachedCaseStudies
      return
    }

    if (activeFetchPromise) {
      await activeFetchPromise
      if (cachedCaseStudies) {
        caseStudies.value = cachedCaseStudies
      }
      return
    }

    activeFetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('case_studies')
          .select('*, categories(name)')
          .order('sort_order', { ascending: true })

        if (error) throw error
        if (data) {
          const mappedCaseStudies: CaseStudy[] = data.map((d: any) => ({
            slug: d.slug,
            title: d.title,
            client: d.client,
            tags: d.tags || [],
            category: d.categories?.name || 'Branding',
            image: d.image,
            heroImage: d.hero_image,
            tagline: d.tagline || undefined,
            services: d.services || undefined,
            industry: d.industry || undefined,
            date: d.date || undefined,
            challenge: d.challenge || '',
            challengeParagraphs: d.challenge_paragraphs || [],
            approach: d.approach || '',
            approachParagraphs: d.approach_paragraphs || [],
            solution: d.solution || [],
            results: (d.results as any) || [],
            resultsSummary: d.results_summary || undefined
          }))
          cachedCaseStudies = mappedCaseStudies
          cacheTime = Date.now()
          caseStudies.value = mappedCaseStudies
        }
      } catch (e) {
        console.error('Error fetching case studies:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || caseStudies.value.length === 0) {
    fetchPromise = fetchCaseStudies()
  }

  const resolveCategoryId = async (categoryName: string | undefined): Promise<string | null> => {
    if (!categoryName) return null
    const { data } = await supabase
      .from('categories')
      .select('id')
      .eq('name', categoryName)
      .limit(1)
      .maybeSingle()
    return data?.id || null
  }

  const addCaseStudy = async (study: CaseStudy) => {
    cachedCaseStudies = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(study.category)
    const payload = {
      slug: study.slug,
      title: study.title,
      client: study.client,
      tags: study.tags,
      category_id: categoryId,
      image: study.image,
      hero_image: study.heroImage,
      tagline: study.tagline || null,
      services: study.services || null,
      industry: study.industry || null,
      date: study.date || null,
      challenge: study.challenge || null,
      challenge_paragraphs: study.challengeParagraphs || [],
      approach: study.approach || null,
      approach_paragraphs: study.approachParagraphs || [],
      solution: study.solution || [],
      results: study.results as any,
      results_summary: study.resultsSummary || null,
      sort_order: caseStudies.value.length + 1,
      published: true
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .insert(payload)
      if (error) throw error
      caseStudies.value.push(study)
    } catch (e) {
      console.error('Error adding case study:', e)
    }
  }

  const updateCaseStudy = async (slug: string, updated: CaseStudy) => {
    cachedCaseStudies = null
    cacheTime = 0
    const categoryId = await resolveCategoryId(updated.category)
    const payload = {
      slug: updated.slug,
      title: updated.title,
      client: updated.client,
      tags: updated.tags,
      category_id: categoryId,
      image: updated.image,
      hero_image: updated.heroImage,
      tagline: updated.tagline || null,
      services: updated.services || null,
      industry: updated.industry || null,
      date: updated.date || null,
      challenge: updated.challenge || null,
      challenge_paragraphs: updated.challengeParagraphs || [],
      approach: updated.approach || null,
      approach_paragraphs: updated.approachParagraphs || [],
      solution: updated.solution || [],
      results: updated.results as any,
      results_summary: updated.resultsSummary || null,
      published: true
    }

    try {
      const { error } = await supabase
        .from('case_studies')
        .update(payload)
        .eq('slug', slug)
      if (error) throw error

      const idx = caseStudies.value.findIndex(s => s.slug === slug)
      if (idx !== -1) {
        caseStudies.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating case study:', e)
    }
  }

  const deleteCaseStudy = async (slug: string) => {
    cachedCaseStudies = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('case_studies')
        .delete()
        .eq('slug', slug)
      if (error) throw error
      caseStudies.value = caseStudies.value.filter(s => s.slug !== slug)
    } catch (e) {
      console.error('Error deleting case study:', e)
    }
  }

  const resetCaseStudies = async () => {
    cachedCaseStudies = null
    cacheTime = 0
    try {
      await supabase.from('case_studies').delete().neq('slug', 'doesnotexist')
      const { data: cats } = await supabase.from('categories').select('*')
      const catMap = new Map<string, string>(cats?.map((c: any) => [c.name.toLowerCase(), c.id]) || [])

      const payloads = defaultCaseStudies.map((s, i) => ({
        slug: s.slug,
        title: s.title,
        client: s.client,
        tags: s.tags,
        category_id: catMap.get(s.category?.toLowerCase() || '') || null,
        image: s.image,
        hero_image: s.heroImage,
        tagline: s.tagline || null,
        services: s.services || null,
        industry: s.industry || null,
        date: s.date || null,
        challenge: s.challenge || null,
        challenge_paragraphs: s.challengeParagraphs || [],
        approach: s.approach || null,
        approach_paragraphs: s.approachParagraphs || [],
        solution: s.solution || [],
        results: s.results as any,
        results_summary: s.resultsSummary || null,
        sort_order: i + 1,
        published: true
      }))

      const { error } = await supabase
        .from('case_studies')
        .insert(payloads)
      if (error) throw error

      caseStudies.value = JSON.parse(JSON.stringify(defaultCaseStudies))
    } catch (e) {
      console.error('Error resetting case studies:', e)
    }
  }

  return {
    caseStudies,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    resetCaseStudies,
    fetchCaseStudies,
    fetchPromise
  }
}
