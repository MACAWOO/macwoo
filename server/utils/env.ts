import type { H3Event } from 'h3'
import { useRuntimeConfig } from '#imports'

export function getSupabaseConfig(event: H3Event) {
  const config = useRuntimeConfig(event)

  const supabaseUrl
    = (config.supabaseUrl as string)
      || (config.public?.supabaseUrl as string)
      || (event.context.cloudflare?.env?.SUPABASE_URL as string)
      || (event.context.cloudflare?.env?.supabaseUrl as string)
      || (process.env.SUPABASE_URL as string)
      || 'https://zzbgqivhggtmrtnizcgm.supabase.co'

  const supabaseKey
    = (config.supabaseKey as string)
      || (config.public?.supabaseKey as string)
      || (event.context.cloudflare?.env?.SUPABASE_KEY as string)
      || (event.context.cloudflare?.env?.supabaseKey as string)
      || (process.env.SUPABASE_KEY as string)
      || 'sb_publishable_KZ7_sePr63HCfe1YCmCcAQ_UztMvcqL'

  return { supabaseUrl, supabaseKey }
}
