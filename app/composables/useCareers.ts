/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSupabase } from './useSupabase'
import { jobs as defaultJobs } from '~/data/careers'
import type { JobListing } from '~/data/careers'

let cachedJobs: JobListing[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useCareers() {
  const supabase = useSupabase()
  const jobs = useState<JobListing[]>('careers', () => [])

  const fetchCareers = async () => {
    if (cachedJobs && (Date.now() - cacheTime < CACHE_TTL)) {
      jobs.value = cachedJobs
      return
    }

    if (activeFetchPromise) {
      await activeFetchPromise
      if (cachedJobs) {
        jobs.value = cachedJobs
      }
      return
    }

    activeFetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('careers')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true })

        if (error) throw error
        if (data) {
          const mappedJobs: JobListing[] = data.map((d: any) => ({
            id: d.id,
            title: d.title,
            department: d.department,
            location: d.location,
            type: d.type,
            experience: d.experience,
            applyUrl: d.apply_url || ''
          }))
          cachedJobs = mappedJobs
          cacheTime = Date.now()
          jobs.value = mappedJobs
        }
      } catch (e) {
        console.error('Error fetching careers:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || jobs.value.length === 0) {
    fetchPromise = fetchCareers()
  }

  const addJob = async (job: Omit<JobListing, 'id'> & { id?: string }) => {
    cachedJobs = null
    cacheTime = 0
    const payload = {
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      experience: job.experience,
      apply_url: job.applyUrl || '',
      is_active: true,
      sort_order: jobs.value.length + 1
    }

    try {
      const { data, error } = await supabase
        .from('careers')
        .insert(payload)
        .select()
        .single()
      if (error) throw error
      if (data) {
        jobs.value.push({
          id: data.id,
          title: data.title,
          department: data.department,
          location: data.location,
          type: data.type,
          experience: data.experience,
          applyUrl: data.apply_url || ''
        })
      }
    } catch (e) {
      console.error('Error adding job listing:', e)
    }
  }

  const updateJob = async (id: string, updated: JobListing) => {
    cachedJobs = null
    cacheTime = 0
    const payload = {
      title: updated.title,
      department: updated.department,
      location: updated.location,
      type: updated.type,
      experience: updated.experience,
      apply_url: updated.applyUrl || ''
    }

    try {
      const { error } = await supabase
        .from('careers')
        .update(payload)
        .eq('id', id)
      if (error) throw error

      const idx = jobs.value.findIndex(j => j.id === id)
      if (idx !== -1) {
        jobs.value.splice(idx, 1, updated)
      }
    } catch (e) {
      console.error('Error updating job listing:', e)
    }
  }

  const deleteJob = async (id: string) => {
    cachedJobs = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('careers')
        .delete()
        .eq('id', id)
      if (error) throw error
      jobs.value = jobs.value.filter(j => j.id !== id)
    } catch (e) {
      console.error('Error deleting job listing:', e)
    }
  }

  const resetCareers = async () => {
    cachedJobs = null
    cacheTime = 0
    try {
      await supabase.from('careers').delete().neq('title', 'doesnotexist')

      const payloads = defaultJobs.map((j, i) => ({
        title: j.title,
        department: j.department,
        location: j.location,
        type: j.type,
        experience: j.experience,
        apply_url: j.applyUrl || '',
        is_active: true,
        sort_order: i + 1
      }))

      const { data, error } = await supabase
        .from('careers')
        .insert(payloads)
        .select()
      if (error) throw error
      if (data) {
        jobs.value = data.map((d: any) => ({
          id: d.id,
          title: d.title,
          department: d.department,
          location: d.location,
          type: d.type,
          experience: d.experience,
          applyUrl: d.apply_url || ''
        }))
      }
    } catch (e) {
      console.error('Error resetting careers:', e)
    }
  }

  return {
    jobs,
    addJob,
    updateJob,
    deleteJob,
    resetCareers,
    fetchCareers,
    fetchPromise
  }
}
