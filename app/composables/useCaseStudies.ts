import { caseStudies as defaultCaseStudies } from '~/data/case-studies'
import type { CaseStudy } from '~/data/case-studies'

export function useCaseStudies() {
  const caseStudies = useState<CaseStudy[]>('caseStudies', () => defaultCaseStudies)

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_case_studies')
    if (stored) {
      try {
        caseStudies.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing case studies from localStorage:', e)
      }
    }
  })

  // Watch and save on client side
  if (import.meta.client) {
    watch(caseStudies, (newStudies) => {
      localStorage.setItem('macwoo_case_studies', JSON.stringify(newStudies))
    }, { deep: true })
  }

  const addCaseStudy = (study: CaseStudy) => {
    caseStudies.value.push(study)
  }

  const updateCaseStudy = (slug: string, updated: CaseStudy) => {
    const idx = caseStudies.value.findIndex(s => s.slug === slug)
    if (idx !== -1) {
      caseStudies.value.splice(idx, 1, updated)
    }
  }

  const deleteCaseStudy = (slug: string) => {
    caseStudies.value = caseStudies.value.filter(s => s.slug !== slug)
  }

  const resetCaseStudies = () => {
    caseStudies.value = JSON.parse(JSON.stringify(defaultCaseStudies))
    localStorage.removeItem('macwoo_case_studies')
  }

  return {
    caseStudies,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    resetCaseStudies
  }
}
