import { createClient } from '@supabase/supabase-js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let supabaseInstance: any = null

export function useSupabase() {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
    if (import.meta.env.PROD) {
      throw new Error('Supabase URL or Key is missing in public runtimeConfig. Supabase integration is required in production.')
    }
    console.warn('Supabase URL or Key is missing in public runtimeConfig. Using fallback client.')
    return createDummyClient()
  }

  try {
    supabaseInstance = createClient(supabaseUrl, supabaseKey)
    return supabaseInstance
  } catch (err) {
    console.error('Failed to initialize Supabase client:', err)
    return createDummyClient()
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function createDummyClient(): any {
  const dummy = () => {}
  return new Proxy(dummy, {
    get(_target, prop) {
      if (prop === 'then') return undefined
      return createDummyClient()
    },
    apply(_target, _thisArg, _argArray) {
      return createDummyClient()
    }
  })
}
