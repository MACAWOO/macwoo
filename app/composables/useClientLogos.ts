import { useSupabase } from './useSupabase'

export interface ClientLogo {
  id: string
  image_url: string
  alt: string
  sort_order: number
}

let cachedLogos: ClientLogo[] | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function useClientLogos() {
  const supabase = useSupabase()
  const logos = useState<ClientLogo[]>('db_client_logos', () => [])

  const fetchLogos = async () => {
    if (cachedLogos && (Date.now() - cacheTime < CACHE_TTL)) {
      logos.value = cachedLogos
      return
    }

    if (activeFetchPromise) {
      await activeFetchPromise
      if (cachedLogos) {
        logos.value = cachedLogos
      }
      return
    }

    activeFetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('client_logos')
          .select('*')
          .order('sort_order', { ascending: true })
        if (error) throw error
        if (data) {
          const logosData: ClientLogo[] = data
          cachedLogos = logosData
          cacheTime = Date.now()
          logos.value = logosData
        }
      } catch (e) {
        console.error('Error fetching client logos:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if empty
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || logos.value.length === 0) {
    fetchPromise = fetchLogos()
  }

  const addLogo = async (imageUrl: string, alt: string) => {
    cachedLogos = null
    cacheTime = 0
    const url = imageUrl.trim()
    if (!url) return

    const sortOrder = logos.value.length
      ? Math.max(...logos.value.map(l => l.sort_order)) + 1
      : 1

    try {
      const { data, error } = await supabase
        .from('client_logos')
        .insert({ image_url: url, alt: alt.trim(), sort_order: sortOrder })
        .select()
        .single()
      if (error) throw error
      if (data) {
        logos.value.push(data)
      }
    } catch (e) {
      console.error('Error adding client logo:', e)
    }
  }

  const updateLogo = async (id: string, patch: Partial<Pick<ClientLogo, 'image_url' | 'alt' | 'sort_order'>>) => {
    cachedLogos = null
    cacheTime = 0
    try {
      const { data, error } = await supabase
        .from('client_logos')
        .update(patch)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      if (data) {
        const idx = logos.value.findIndex(l => l.id === id)
        if (idx !== -1) logos.value[idx] = data
      }
    } catch (e) {
      console.error('Error updating client logo:', e)
    }
  }

  const deleteLogo = async (id: string) => {
    cachedLogos = null
    cacheTime = 0
    try {
      const { error } = await supabase
        .from('client_logos')
        .delete()
        .eq('id', id)
      if (error) throw error
      logos.value = logos.value.filter(l => l.id !== id)
    } catch (e) {
      console.error('Error deleting client logo:', e)
    }
  }

  return {
    logos,
    addLogo,
    updateLogo,
    deleteLogo,
    fetchLogos,
    fetchPromise
  }
}
