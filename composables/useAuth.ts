import type { User, Session, AuthChangeEvent } from '@supabase/supabase-js'

export const useAuth = () => {
  const config = useRuntimeConfig()
  const supabaseConfigured = Boolean((config.public as any).supabaseUrl && (config.public as any).supabaseKey)

  // If Supabase is configured, use real client; otherwise fall back to a simple dev mock stored in localStorage
  const supabase = supabaseConfigured ? useSupabase() : null
  const user = useState<User | null>('user', () => null)
  const session = useState<Session | null>('session', () => null)

  // --- DEV MOCK HELPERS (only used when Supabase is not configured) ---
  const MOCK_USERS_KEY = 'cf:mock_users'
  const MOCK_CURRENT_KEY = 'cf:mock_current'

  const readMockUsers = (): Array<{ email: string; password: string; display_name?: string }> => {
    try {
      const raw = localStorage.getItem(MOCK_USERS_KEY)
      return raw ? JSON.parse(raw) : []
    } catch (e) {
      return []
    }
  }

  const writeMockUsers = (u: Array<{ email: string; password: string; display_name?: string }>) => {
    try { localStorage.setItem(MOCK_USERS_KEY, JSON.stringify(u)) } catch (e) { /* ignore */ }
  }

  const setMockCurrent = (email: string | null) => {
    try {
      if (email) localStorage.setItem(MOCK_CURRENT_KEY, email)
      else localStorage.removeItem(MOCK_CURRENT_KEY)
    } catch (e) { /* ignore */ }
  }

  const getMockCurrent = () => {
    try { return localStorage.getItem(MOCK_CURRENT_KEY) } catch (e) { return null }
  }

  // Initialize auth state
  const initAuth = async () => {
    if (supabase) {
      const { data } = await supabase.auth.getSession()
      session.value = data.session
      user.value = data.session?.user ?? null

      // Listen for auth changes
      supabase.auth.onAuthStateChange((_event: AuthChangeEvent, newSession: Session | null) => {
        session.value = newSession
        user.value = newSession?.user ?? null
      })
    } else {
      // Dev/mock mode: try to restore current user from localStorage
      if (!import.meta.env.SSR) {
        const email = getMockCurrent()
        if (email) {
          const found = readMockUsers().find(u => u.email === email) || null
          if (found) {
            // create a minimal user/session object to keep rest of app happy
            user.value = { id: 'mock:' + found.email, email: found.email, user_metadata: { display_name: found.display_name } } as unknown as User
            session.value = { user: user.value } as unknown as Session
          }
        }
      }
    }
  }

  // Sign up with email and password
  const signUp = async (email: string, password: string, displayName?: string) => {
    if (supabase) {
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

    // Dev/mock signup
    if (!import.meta.env.SSR) {
      const users = readMockUsers()
      if (users.find(u => u.email === email)) {
        const err: any = new Error('User already exists')
        err.status = 400
        throw err
      }
      users.push({ email, password, display_name: displayName })
      writeMockUsers(users)
      setMockCurrent(email)
      user.value = { id: 'mock:' + email, email, user_metadata: { display_name: displayName } } as unknown as User
      session.value = { user: user.value } as unknown as Session
      return { user: user.value }
    }

    throw new Error('Sign up not available on server')
  }

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error
      return data
    }

    // Dev/mock sign in
    if (!import.meta.env.SSR) {
      const users = readMockUsers()
      const found = users.find(u => u.email === email && u.password === password)
      if (!found) {
        const err: any = new Error('Invalid credentials')
        err.status = 401
        throw err
      }
      setMockCurrent(email)
      user.value = { id: 'mock:' + found.email, email: found.email, user_metadata: { display_name: found.display_name } } as unknown as User
      session.value = { user: user.value } as unknown as Session
      return { user: user.value }
    }

    throw new Error('Sign in not available on server')
  }

  // Sign in with OAuth (Google, GitHub, etc.)
  const signInWithOAuth = async (provider: 'google' | 'github') => {
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${globalThis.location.origin}/auth/callback`
        }
      })

      if (error) throw error
      return data
    }

    // Dev/mock OAuth: create a fake provider user
    if (!import.meta.env.SSR) {
      const email = `mock+${provider}@local`
      const display_name = `${provider} user`
      // ensure user exists
      const users = readMockUsers()
      if (!users.find(u => u.email === email)) {
        users.push({ email, password: '', display_name })
        writeMockUsers(users)
      }
      setMockCurrent(email)
      user.value = { id: 'mock:' + email, email, user_metadata: { display_name } } as unknown as User
      session.value = { user: user.value } as unknown as Session
      return { url: `${globalThis.location.origin}/auth/callback`, provider }
    }

    throw new Error('OAuth not available on server')
  }

  // Sign out
  const signOut = async () => {
    if (supabase) {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } else {
      // clear mock
      if (!import.meta.env.SSR) {
        setMockCurrent(null)
      }
    }

    user.value = null
    session.value = null
  }

  // Reset password
  const resetPassword = async (email: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${globalThis.location.origin}/auth/reset-password`
      })

      if (error) throw error
      return data
    }

    // Dev/mock: pretend an email was sent
    if (!import.meta.env.SSR) {
      return { message: 'Password reset (mock): check local dev mailbox.' }
    }

    throw new Error('Reset password not available on server')
  }

  // Update password
  const updatePassword = async (newPassword: string) => {
    if (supabase) {
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error
      return data
    }

    // Dev/mock: no-op
    if (!import.meta.env.SSR) {
      return { message: 'Password updated (mock)' }
    }

    throw new Error('Update password not available on server')
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
