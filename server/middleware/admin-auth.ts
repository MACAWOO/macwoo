import { defineEventHandler, getCookie, deleteCookie, sendRedirect, getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const path = event.path

  // Skip during build-time prerendering
  const isPrerender = getRequestHeader(event, 'x-nitro-prerender')
  if (isPrerender) return

  // Target any request to /admin (excluding login and static files/assets)
  const isAdminRoute = /^\/admin(\/|$)/i.test(path)
  const isLoginRoute = /^\/admin\/login(\/|$)/i.test(path)

  if (isAdminRoute && !isLoginRoute) {
    const token = getCookie(event, 'sb-access-token')

    if (!token) {
      return sendRedirect(event, '/admin/login', 302)
    }

    const { supabaseUrl, supabaseKey } = getSupabaseConfig(event)

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
