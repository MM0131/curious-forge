import { defineEventHandler, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Minimal server-side monitor: log metrics. In production, replace with real monitoring sink.
  console.info('[monitor]', new Date().toISOString(), body)

  return { status: 'ok' }
})
