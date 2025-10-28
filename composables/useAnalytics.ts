import { useRuntimeConfig } from '#app'

type AnalyticsProps = Record<string, string | number | boolean | null | undefined>

export function useAnalytics() {
  const config = useRuntimeConfig()
  const domain = (config.public as any)?.plausibleDomain || ''

  const track = (event: string, props?: AnalyticsProps) => {
    if (!import.meta.client) return
    const plausible = (globalThis.window as any)?.plausible as undefined | ((e: string, opts?: { props?: AnalyticsProps }) => void)
    if (typeof plausible === 'function') {
      plausible(event, props ? { props } : undefined)
      return
    }
    // Fallback: dev log to console for visibility
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.debug('[analytics]', event, props || {})
    }
  }

  return { track, domain }
}
