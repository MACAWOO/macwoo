export function useCategories() {
  const categories = useState<string[]>('categories', () => ['Branding', 'Marketing', 'Video Production'])

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_categories')
    if (stored) {
      try {
        categories.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing categories from localStorage:', e)
      }
    }
  })

  if (import.meta.client) {
    watch(categories, (newCats) => {
      localStorage.setItem('macwoo_categories', JSON.stringify(newCats))
    }, { deep: true })
  }

  const addCategory = (cat: string) => {
    const trimmed = cat.trim()
    if (trimmed && !categories.value.includes(trimmed)) {
      categories.value.push(trimmed)
    }
  }

  const deleteCategory = (cat: string) => {
    categories.value = categories.value.filter(c => c !== cat)
  }

  const resetCategories = () => {
    categories.value = ['Branding', 'Marketing', 'Video Production']
    localStorage.removeItem('macwoo_categories')
  }

  return {
    categories,
    addCategory,
    deleteCategory,
    resetCategories
  }
}
