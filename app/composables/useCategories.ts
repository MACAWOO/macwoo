import { useSupabase } from './useSupabase'

export interface Category {
  id: string
  name: string
  slug: string
  sort_order: number
}

export function useCategories() {
  const supabase = useSupabase()
  const dbCategories = useState<Category[]>('db_categories', () => [])
  const categories = computed(() => dbCategories.value.map(c => c.name))

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order', { ascending: true })
      if (error) throw error
      if (data) {
        dbCategories.value = data
      }
    } catch (e) {
      console.error('Error fetching categories:', e)
    }
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || dbCategories.value.length === 0) {
    fetchPromise = fetchCategories()
  }

  const addCategory = async (catName: string) => {
    const trimmed = catName.trim()
    if (!trimmed) return
    if (dbCategories.value.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return

    const slug = trimmed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    const sortOrder = dbCategories.value.length + 1

    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({ name: trimmed, slug, sort_order: sortOrder })
        .select()
        .single()
      if (error) throw error
      if (data) {
        dbCategories.value.push(data)
      }
    } catch (e) {
      console.error('Error adding category:', e)
    }
  }

  const deleteCategory = async (catName: string) => {
    const target = dbCategories.value.find(c => c.name === catName)
    if (!target) return
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', target.id)
      if (error) throw error
      dbCategories.value = dbCategories.value.filter(c => c.id !== target.id)
    } catch (e) {
      console.error('Error deleting category:', e)
    }
  }

  const resetCategories = async () => {
    const defaults = [
      { name: 'Branding', slug: 'branding', sort_order: 1 },
      { name: 'Marketing', slug: 'marketing', sort_order: 2 },
      { name: 'Video Production', slug: 'video-production', sort_order: 3 },
      { name: 'Digital Marketing', slug: 'digital-marketing', sort_order: 4 }
    ]
    try {
      // Clear all
      await supabase.from('categories').delete().neq('id', '00000000-0000-0000-0000-000000000000')
      const { data, error } = await supabase
        .from('categories')
        .insert(defaults)
        .select()
      if (error) throw error
      if (data) {
        dbCategories.value = data
      }
    } catch (e) {
      console.error('Error resetting categories:', e)
    }
  }

  return {
    dbCategories,
    categories,
    addCategory,
    deleteCategory,
    resetCategories,
    fetchCategories,
    fetchPromise
  }
}
