import fs from 'fs'
const s = fs.readFileSync('./assets/data/blueprints.en.ts', 'utf8')
const ids = ['volcano','lava-lamp','bridge','seismograph','automated-greenhouse','weather-station']
const thai = /[\u0E00-\u0E7F]/
for (const id of ids) {
  const re = new RegExp("'" + id.replace(/[-\\]/g, '\\\\$&') + "'\\s*:\\s*\\{([\\s\\S]*?)\\n\\s*\\},", 'm')
  const m = s.match(re)
  if (!m) {
    console.log(id + ': not found in MANUAL_EN')
    continue
  }
  const body = m[1]
  const get = (k) => {
    const r = new RegExp(k + "\\s*:\\s*(?:\\[([\\s\\S]*?)\\]|(['\"]))")
    const mm = body.match(r)
    if (!mm) return ''
    // if array matched, mm[1] contains array contents; otherwise string captured in mm[2]
    const val = mm[1] || mm[2] || ''
    return val.replace(/\\n/g, ' ').replace(/\"/g, ' ').trim()
  }
  const title = get('title')
  const purpose = get('purpose')
  const desc = get('description')
  const sci = get('sciencePrinciple')
  const fun = get('funFacts')
  console.log(id + ': title:' + (thai.test(title) ? 'TH' : '-') + ' purpose:' + (thai.test(purpose) ? 'TH' : '-') + ' description:' + (thai.test(desc) ? 'TH' : '-') + ' sciencePrinciple:' + (thai.test(sci) ? 'TH' : '-') + ' funFacts:' + (thai.test(fun) ? 'TH' : '-'))
}
