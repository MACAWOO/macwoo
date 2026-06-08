import { jobs as defaultJobs } from '~/data/careers'
import type { JobListing } from '~/data/careers'

export function useCareers() {
  const jobs = useState<JobListing[]>('careers', () => defaultJobs)

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_jobs')
    if (stored) {
      try {
        jobs.value = JSON.parse(stored)
      } catch (e) {
        console.error('Error parsing jobs from localStorage:', e)
      }
    }
  })

  // Watch and save on client side
  if (import.meta.client) {
    watch(jobs, (newJobs) => {
      localStorage.setItem('macwoo_jobs', JSON.stringify(newJobs))
    }, { deep: true })
  }

  const addJob = (job: JobListing) => {
    jobs.value.push(job)
  }

  const updateJob = (id: string, updated: JobListing) => {
    const idx = jobs.value.findIndex(j => j.id === id)
    if (idx !== -1) {
      jobs.value.splice(idx, 1, updated)
    }
  }

  const deleteJob = (id: string) => {
    jobs.value = jobs.value.filter(j => j.id !== id)
  }

  const resetCareers = () => {
    jobs.value = JSON.parse(JSON.stringify(defaultJobs))
    localStorage.removeItem('macwoo_jobs')
  }

  return {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    resetCareers
  }
}
