import { createClient } from '@supabase/supabase-js'

let supabaseInstance: any = null

export function useSupabase() {
  if (supabaseInstance) return supabaseInstance

  const config = useRuntimeConfig()
  const supabaseUrl = config.public.supabaseUrl as string
  const supabaseKey = config.public.supabaseKey as string

  if (!supabaseUrl || !supabaseKey) {
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

function createDummyClient(): any {
  const dummy = () => {}
  return new Proxy(dummy, {
    get(target, prop) {
      if (prop === 'then') return undefined
      return createDummyClient()
    },
    apply(target, thisArg, argArray) {
      return createDummyClient()
    }
  })
}
