import { defineEventHandler } from 'h3'
import { createClient } from '@supabase/supabase-js'

interface SitemapUrl {
  loc: string
  lastmod?: string
  changefreq?: string
  priority?: number
}

interface DbRow {
  slug: string
  updated_at?: string
  created_at?: string
}

export default defineEventHandler(async () => {
  const supabaseUrl = process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co'
  const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'
  const supabase = createClient(supabaseUrl, supabaseKey)

  const urls: SitemapUrl[] = []

  // 1. Fetch Blog Posts
  try {
    const { data: blogs } = await supabase
      .from('blog_posts')
      .select('slug, updated_at, created_at')
      .eq('published', true)

    if (blogs) {
      blogs.forEach((blog: DbRow) => {
        urls.push({
          loc: `/blog/${blog.slug}`,
          lastmod: blog.updated_at || blog.created_at || undefined,
          changefreq: 'weekly',
          priority: 0.8
        })
      })
    }
  } catch (err) {
    console.error('Error fetching blogs for sitemap:', err)
  }

  // 2. Fetch Portfolio Projects
  try {
    const { data: projects } = await supabase
      .from('portfolio_projects')
      .select('slug, updated_at, created_at')
      .eq('published', true)

    if (projects) {
      projects.forEach((proj: DbRow) => {
        urls.push({
          loc: `/portfolio/${proj.slug}`,
          lastmod: proj.updated_at || proj.created_at || undefined,
          changefreq: 'monthly',
          priority: 0.7
        })
      })
    }
  } catch (err) {
    console.error('Error fetching portfolio for sitemap:', err)
  }

  // 3. Fetch Case Studies
  try {
    const { data: studies } = await supabase
      .from('case_studies')
      .select('slug, updated_at, created_at')
      .eq('published', true)

    if (studies) {
      studies.forEach((study: DbRow) => {
        urls.push({
          loc: `/case-studies/${study.slug}`,
          lastmod: study.updated_at || study.created_at || undefined,
          changefreq: 'monthly',
          priority: 0.8
        })
      })
    }
  } catch (err) {
    console.error('Error fetching case studies for sitemap:', err)
  }

  return urls
})
