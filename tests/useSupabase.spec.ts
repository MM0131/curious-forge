import { describe, it, expect, vi } from 'vitest'

// Mock the Supabase client factory so unit test doesn't call real network
vi.mock('@supabase/supabase-js', () => ({
  createClient: vi.fn((url: string, key: string) => ({ url, key, from: () => ({}) }))
}))

describe('useSupabase composable', () => {
  it('creates a client using runtime config', async () => {
    // Mock runtime config before importing module
  // @ts-expect-error: mocked runtime config for test
  globalThis.useRuntimeConfig = () => ({ public: { supabaseUrl: 'https://x', supabaseKey: 'k' } })

    // Import after mocking so the module reads mocked runtime config
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const mod = await import('../composables/useSupabase')
    const { useSupabase } = mod

    const client = useSupabase()
    expect(client).toHaveProperty('url', 'https://x')
    expect(client).toHaveProperty('key', 'k')
  })
})
