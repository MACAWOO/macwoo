import { defineEventHandler, getCookie, deleteCookie, sendRedirect } from 'h3'

// Secondary gate for /admin requests that reach the Worker.
//
// NOTE: `/admin` and `/admin/login` are prerendered and listed in the generated
// `_routes.json` exclude list, so Cloudflare Pages serves those two as static
// assets and this middleware never runs for them. That is fine — they are
// `ssr: false` shells with no server-rendered data. Real authorization is
// enforced by Supabase RLS on every read and write; this only covers any other
// /admin/* path that does hit the Worker.
export default defineEventHandler(async (event) => {
  const path = event.path

  // Skip during build-time prerendering. `import.meta.prerender` is set by
  // Nitro at build time — the previous check read an `x-nitro-prerender`
  // request header, which any caller could set to skip this gate.
  if (import.meta.prerender) return

  // Target any request to /admin (excluding login and static files/assets)
  const isAdminRoute = /^\/admin(\/|$)/i.test(path)
  const isLoginRoute = /^\/admin\/login(\/|$)/i.test(path)

  if (isAdminRoute && !isLoginRoute) {
    const token = getCookie(event, 'sb-access-token')

    if (!token) {
      return sendRedirect(event, '/admin/login', 302)
    }

    const supabaseUrl = process.env.SUPABASE_URL || 'https://vewmzejakdfsgsyxdlpa.supabase.co'
    const supabaseKey = process.env.SUPABASE_KEY || 'sb_publishable_SjN1foafYhhbb3k-DI82Aw_xsjStWt_'

    try {
      const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
        method: 'GET',
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${token}`
        }
      })

      if (!response.ok) {
        // Clear token cookie and redirect if token is invalid or expired
        deleteCookie(event, 'sb-access-token', { path: '/' })
        return sendRedirect(event, '/admin/login', 302)
      }

      // Session is valid, optionally attach user to request context
      const user = await response.json()
      event.context.user = user
    } catch (error) {
      console.error('Error validating token in server middleware:', error)
      return sendRedirect(event, '/admin/login', 302)
    }
  }
})
