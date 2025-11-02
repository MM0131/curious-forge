export function formatTimeEnglish(t: any): string {
  if (!t && t !== 0) return ''
  let s = String(t)
  // common Thai -> English replacements
  s = s.replace(/นาที/g, 'minutes')
  s = s.replace(/นาที/g, 'minutes')
  s = s.replace(/ชั่วโมง/g, 'hours')
  s = s.replace(/วัน/g, 'days')
  s = s.replace(/สัปดาห์/g, 'weeks')
  s = s.replace(/เตรียม/g, 'prep')
  // normalize ranges like "2-4 ชั่วโมง" -> "2-4 hours"
  s = s.replace(/\s+/g, ' ').trim()
  return s
}

export default formatTimeEnglish
