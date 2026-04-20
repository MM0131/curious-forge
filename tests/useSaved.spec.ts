import { describe, it, expect, beforeEach } from 'vitest'

// We'll stub global `useRuntimeConfig` used by composable
describe('isSupabaseConfigured helper', () => {
  beforeEach(() => {
    // clear any previous global
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    delete globalThis.useRuntimeConfig
  })

  it('returns true when public supabase vars present', async () => {
  // @ts-expect-error: mocked runtime config for test
  globalThis.useRuntimeConfig = () => ({ public: { supabaseUrl: 'https://x', supabaseKey: 'k' } })
    // dynamically import after mocking runtime config so the module reads the mocked function
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import('../utils/isSupabaseConfigured')
    const { isSupabaseConfigured } = mod
    expect(isSupabaseConfigured()).toBe(true)
  })

  it('returns false when missing public supabase vars', async () => {
  // @ts-expect-error: mocked runtime config for test
  globalThis.useRuntimeConfig = () => ({ public: { } })
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import('../utils/isSupabaseConfigured')
    const { isSupabaseConfigured } = mod
    expect(isSupabaseConfigured()).toBe(false)
  })
})
