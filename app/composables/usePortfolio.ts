import { projects as defaultProjects } from '~/data/portfolio'
import type { PortfolioProject } from '~/data/portfolio'

export interface AdminPortfolioProject extends PortfolioProject {
  featured?: boolean
  displayOrder?: number
}

// Map the default static projects so they have default featured = true and order
const initialProjects: AdminPortfolioProject[] = defaultProjects.map((p, i) => ({
  ...p,
  featured: true,
  displayOrder: i + 1
}))

export function usePortfolio() {
  const projects = useState<AdminPortfolioProject[]>('portfolio', () => initialProjects)

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_projects')
    if (stored) {
      try {
        projects.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing projects from localStorage:', e)
      }
    }
  })

  // Watch and save on client side
  if (import.meta.client) {
    watch(projects, (newProjects) => {
      localStorage.setItem('macwoo_projects', JSON.stringify(newProjects))
    }, { deep: true })
  }

  const addProject = (project: AdminPortfolioProject) => {
    // Assign default order if not provided
    if (project.displayOrder === undefined) {
      project.displayOrder = projects.value.length + 1
    }
    if (project.featured === undefined) {
      project.featured = true
    }
    projects.value.push(project)
  }

  const updateProject = (slug: string, updated: AdminPortfolioProject) => {
    const idx = projects.value.findIndex(p => p.slug === slug)
    if (idx !== -1) {
      projects.value.splice(idx, 1, updated)
    }
  }

  const deleteProject = (slug: string) => {
    projects.value = projects.value.filter(p => p.slug !== slug)
  }

  const resetPortfolio = () => {
    projects.value = JSON.parse(JSON.stringify(initialProjects))
    localStorage.removeItem('macwoo_projects')
  }

  return {
    projects,
    addProject,
    updateProject,
    deleteProject,
    resetPortfolio
  }
}
