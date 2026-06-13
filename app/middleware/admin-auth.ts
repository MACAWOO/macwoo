import { useSupabase } from '~/composables/useSupabase'

// Protects /admin routes. Runs client-side (admin pages are ssr:false).
// Real authorization is enforced by Supabase RLS using the session token;
// this guard only controls UI access and redirects.
export default defineNuxtRouteMiddleware(async (to) => {
  if (!import.meta.client) return
  if (to.path === '/admin/login') return

  const supabase = useSupabase()
  const { data } = await supabase.auth.getSession()

  if (!data.session) {
    return navigateTo('/admin/login')
  }
})
