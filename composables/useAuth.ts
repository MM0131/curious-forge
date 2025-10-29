import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export const useAuth = () => {
  const supabase = useSupabase()
  const user = useState<User | null>('user', () => null)
  const session = useState<Session | null>('session', () => null)

  // Initialize auth state
  const initAuth = async () => {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user ?? null

    // Listen for auth changes
    supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
      session.value = newSession
      user.value = newSession?.user ?? null
    })
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName
        }
      }
    })

    if (error) throw error
    return data
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) throw error
    return data
  }

  // Sign in with OAuth (Google, GitHub, etc.)
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${globalThis.location.origin}/auth/callback`
      }
    })

    if (error) throw error
    return data
  }

  // Sign out
  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    
    user.value = null
    session.value = null
  }

  // Reset password
  const resetPassword = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${globalThis.location.origin}/auth/reset-password`
    })

    if (error) throw error
    return data
  }

  // Update password
  const updatePassword = async (newPassword: string) => {
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword
    })

    if (error) throw error
    return data
  }

  return {
    user: readonly(user),
    session: readonly(session),
    initAuth,
    signUp,
    signIn,
    signInWithOAuth,
    signOut,
    resetPassword,
    updatePassword,
    isAuthenticated: computed(() => !!user.value)
  }
}
