export function useMonitoring() {
  const report = async (name: string, payload: any = {}) => {
    try {
      await fetch('/api/monitor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, payload, ts: new Date().toISOString() })
      })
    } catch (err) {
      // swallow errors to avoid impacting UX; logs available server-side if needed
      // eslint-disable-next-line no-console
      console.debug('monitoring failed', err)
    }
  }

  return { report }
}
