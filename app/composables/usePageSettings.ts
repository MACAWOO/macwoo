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
  careersHeroImage: '/Images/Designing.jpeg',
  careersHeroVideo: '/Background_Videos/Careers.mp4',
  contactHeroImage: '/Images/Marketing.jpeg',
  contactHeroVideo: '/Background_Videos/Contact.mp4'
}

export function usePageSettings() {
  const settings = useState<PageSettings>('page_settings', () => ({ ...defaultSettings }))

  onMounted(() => {
    const stored = localStorage.getItem('macwoo_page_settings')
    if (stored) {
      try {
        settings.value = { ...defaultSettings, ...JSON.parse(stored) }
      } catch (e) {
        console.error('Error parsing page settings from localStorage:', e)
      }
    }
  })

  if (import.meta.client) {
    watch(settings, (newSettings) => {
      localStorage.setItem('macwoo_page_settings', JSON.stringify(newSettings))
    }, { deep: true })
  }

  const updateSettings = (updated: Partial<PageSettings>) => {
    settings.value = { ...settings.value, ...updated }
  }

  const resetSettings = () => {
    settings.value = { ...defaultSettings }
    localStorage.removeItem('macwoo_page_settings')
  }

  return {
    settings,
    updateSettings,
    resetSettings
  }
}
