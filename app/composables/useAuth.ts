import type { Session, User } from '@supabase/supabase-js'
import { useSupabase } from '~/composables/useSupabase'

export function useAuth() {
  const supabase = useSupabase()
  const user = useState<User | null>('auth_user', () => null)
  const isReady = useState<boolean>('auth_ready', () => false)

  const tokenCookie = useCookie<string | null>('sb-access-token', {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/'
  })

  // Initialise session state on the client and keep it in sync.
  const init = async () => {
    if (!import.meta.client) return
    const { data } = await supabase.auth.getSession()
    user.value = data.session?.user ?? null
    tokenCookie.value = data.session?.access_token ?? null
    isReady.value = true

    supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      user.value = session?.user ?? null
      tokenCookie.value = session?.access_token ?? null
    })
  }

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    user.value = data.user
    return data.user
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    user.value = null
  }

  const isAuthenticated = computed(() => !!user.value)

  return { user, isReady, isAuthenticated, init, signIn, signOut }
}
