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
    const r = new RegExp(k + "\\s*:\\s*(['\"])([\\s\\S]*?)\\1")
    const mm = body.match(r)
    return mm ? mm[2].replace(/\\\"/g, '"').replace(/\\n/g, ' ') : ''
  }
  const title = get('title')
  const purpose = get('purpose')
  const desc = get('description')
  console.log(id + ': title:' + (thai.test(title) ? 'TH' : '-') + ' purpose:' + (thai.test(purpose) ? 'TH' : '-') + ' description:' + (thai.test(desc) ? 'TH' : '-'))
}
