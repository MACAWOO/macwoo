import { useSupabase } from './useSupabase'
import type { Database } from '~/types/supabase'

export interface PageSettings {
  indexHeroImage: string
  indexHeroVideo: string
  aboutHeroImage: string
  aboutHeroVideo: string
  blogHeroImage: string
  blogHeroVideo: string
  servicesBrandingImage: string
  servicesMarketingImage: string
  servicesVideoImage: string
  servicesVideoShowreel: string
  careersHeroImage: string
  careersHeroVideo: string
  contactHeroImage: string
  contactHeroVideo: string
}

const defaultSettings: PageSettings = {
  indexHeroImage: '/Images/hero.png',
  indexHeroVideo: '',
  aboutHeroImage: '/Images/Branding.jpeg',
  aboutHeroVideo: '/Background_Videos/About.mp4',
  blogHeroImage: '/Images/Branding.jpeg',
  blogHeroVideo: '/Background_Videos/Blog.mp4',
  servicesBrandingImage: '/Images/Branding.jpeg',
  servicesMarketingImage: '/Images/Digital_Marketing.jpeg',
  servicesVideoImage: '/Images/Video_Production.jpeg',
  servicesVideoShowreel: '/Background_Videos/Portfolio.mp4',
  careersHeroImage: '/Images/Designing.jpeg',
  careersHeroVideo: '/Background_Videos/Careers.mp4',
  contactHeroImage: '/Images/Marketing.jpeg',
  contactHeroVideo: '/Background_Videos/Contact.mp4'
}

type DbPageSettings = Database['public']['Tables']['page_settings']['Row']

function mapDbToSettings(db: DbPageSettings): PageSettings {
  return {
    indexHeroImage: db.index_hero_image || '/Images/hero.png',
    indexHeroVideo: db.index_hero_video || '',
    aboutHeroImage: db.about_hero_image || '/Images/Branding.jpeg',
    aboutHeroVideo: db.about_hero_video || '/Background_Videos/About.mp4',
    blogHeroImage: db.blog_hero_image || '/Images/Branding.jpeg',
    blogHeroVideo: db.blog_hero_video || '/Background_Videos/Blog.mp4',
    servicesBrandingImage: db.services_branding_image || '/Images/Branding.jpeg',
    servicesMarketingImage: db.services_marketing_image || '/Images/Digital_Marketing.jpeg',
    servicesVideoImage: db.services_video_image || '/Images/Video_Production.jpeg',
    servicesVideoShowreel: db.services_video_showreel || '/Background_Videos/Portfolio.mp4',
    careersHeroImage: db.careers_hero_image || '/Images/Designing.jpeg',
    careersHeroVideo: db.careers_hero_video || '/Background_Videos/Careers.mp4',
    contactHeroImage: db.contact_hero_image || '/Images/Marketing.jpeg',
    contactHeroVideo: db.contact_hero_video || '/Background_Videos/Contact.mp4'
  }
}

function mapSettingsToDb(settings: PageSettings): Omit<Database['public']['Tables']['page_settings']['Insert'], 'id' | 'updated_at'> {
  return {
    index_hero_image: settings.indexHeroImage,
    index_hero_video: settings.indexHeroVideo,
    about_hero_image: settings.aboutHeroImage,
    about_hero_video: settings.aboutHeroVideo,
    blog_hero_image: settings.blogHeroImage,
    blog_hero_video: settings.blogHeroVideo,
    services_branding_image: settings.servicesBrandingImage,
    services_marketing_image: settings.servicesMarketingImage,
    services_video_image: settings.servicesVideoImage,
    services_video_showreel: settings.servicesVideoShowreel,
    careers_hero_image: settings.careersHeroImage,
    careers_hero_video: settings.careersHeroVideo,
    contact_hero_image: settings.contactHeroImage,
    contact_hero_video: settings.contactHeroVideo
  }
}

let cachedSettings: PageSettings | null = null
let cacheTime = 0
let activeFetchPromise: Promise<void> | null = null
const CACHE_TTL = 300000 // 5 minutes

export function usePageSettings() {
  const supabase = useSupabase()
  const settings = useState<PageSettings>('page_settings', () => ({ ...defaultSettings }))

  const fetchSettings = async () => {
    if (cachedSettings && (Date.now() - cacheTime < CACHE_TTL)) {
      settings.value = cachedSettings
      return
    }

    if (activeFetchPromise) {
      await activeFetchPromise
      if (cachedSettings) {
        settings.value = cachedSettings
      }
      return
    }

    activeFetchPromise = (async () => {
      try {
        const { data, error } = await supabase
          .from('page_settings')
          .select('*')
          .limit(1)
          .maybeSingle()

        if (error) throw error
        if (data) {
          cachedSettings = mapDbToSettings(data)
          cacheTime = Date.now()
          settings.value = cachedSettings
        }
      } catch (e) {
        console.error('Error fetching page settings from Supabase:', e)
      } finally {
        activeFetchPromise = null
      }
    })()

    await activeFetchPromise
  }

  // Trigger fetch on server or if clean default
  let fetchPromise: Promise<void> | null = null
  if (import.meta.server || settings.value.indexHeroImage === defaultSettings.indexHeroImage) {
    fetchPromise = fetchSettings()
  }

  const updateSettings = async (updated: Partial<PageSettings>) => {
    cachedSettings = null
    cacheTime = 0
    settings.value = { ...settings.value, ...updated }
    try {
      const { data: current } = await supabase
        .from('page_settings')
        .select('id')
        .limit(1)
        .maybeSingle()

      const payload = mapSettingsToDb(settings.value)
      if (current?.id) {
        const { error } = await supabase
          .from('page_settings')
          .update(payload)
          .eq('id', current.id)
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('page_settings')
          .insert(payload)
        if (error) throw error
      }
    } catch (e) {
      console.error('Failed to save page settings to Supabase:', e)
    }
  }

  const resetSettings = async () => {
    cachedSettings = null
    cacheTime = 0
    settings.value = { ...defaultSettings }
    await updateSettings(defaultSettings)
  }

  return {
    settings,
    updateSettings,
    resetSettings,
    fetchSettings,
    fetchPromise
  }
}
