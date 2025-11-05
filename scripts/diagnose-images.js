const fs = require('node:fs');
const path = require('node:path');

const base = JSON.parse(fs.readFileSync('assets/data/blueprints.json', 'utf8'))

let full = []
try {
	full = JSON.parse(fs.readFileSync('assets/data/blueprints.en.full.json', 'utf8'))
} catch (err) {
	// If the extended file isn't present, continue with base data
	console.error('Warning: could not read blueprints.en.full.json:', err.message)
}

const fullById = full.reduce((acc, bp) => {
	if (bp && bp.id) acc[bp.id] = bp
	return acc
}, {})

const result = base.map(b => {
	const f = fullById[b.id] || {}
	return { ...b, ...f }
})

const imgs = fs.readdirSync('public/assets/images')

function englishTitle(s) {
	if (!s) return ''
	const m = s.match(/\(([^)]+)\)/)
	if (m && m[1]) return m[1].trim()
	return s
}

result.sort((a, b) => englishTitle(a.title).localeCompare(englishTitle(b.title), 'en'))

const top = result.slice(0, 36).map((r, i) => {
	const img = r.image || '(none)'
	const fname = img ? path.basename(img) : ''
	return {
		pos: i + 1,
		id: r.id,
		title: englishTitle(r.title),
		image: img,
		file: fname,
		exists: fname ? imgs.includes(fname) : false
	}
})

console.table(top)

// Also list any -photo files that were added but not matched to JSON entries
const photoFiles = imgs.filter((f) => /-photo\./.test(f))
const idsFromPhotos = photoFiles.map((f) => f.replace(/-photo\.[^.]+$/, ''))
const idsInJson = new Set(result.map((r) => r.id))
const unmapped = idsFromPhotos.filter((id) => !idsInJson.has(id))

console.log('\n-photo files present:', photoFiles)
console.log('\n-photo ids not found in JSON (unmapped):', unmapped)
