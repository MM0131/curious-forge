const fs = require('fs');
const basePath = 'assets/data/blueprints.json';
const fullPath = 'assets/data/blueprints.en.full.json';
const base = JSON.parse(fs.readFileSync(basePath, 'utf8'));
let full = [];
try { full = JSON.parse(fs.readFileSync(fullPath, 'utf8')) } catch (e) { full = [] }
const fullById = Object.fromEntries(full.map(b => [b.id, b]));
const merged = base.map(b => {
  const f = fullById[b.id] || {};
  const mergedObj = Object.assign({}, b, f);
  // If an image path was provided (from base or full), keep it only if the file exists or
  // it's an external URL. Otherwise, remove it. If no image was provided, try to find one.
  if (mergedObj.image) {
    const img = String(mergedObj.image)
    if (!img.startsWith('http')) {
      const candidate = img.replace(/^\//, '')
      const alt1 = candidate
      const alt2 = `public/${candidate}`
      if (fs.existsSync(alt1)) {
        // normalize to start with '/'
        mergedObj.image = `/${alt1}`
      } else if (fs.existsSync(alt2)) {
        mergedObj.image = `/${alt2}`
      } else {
        delete mergedObj.image
      }
    }
  } else {
    const candidate1 = `assets/images/${b.id}.svg`
    const candidate2 = `public/assets/images/${b.id}.svg`
    if (fs.existsSync(candidate1)) mergedObj.image = `/${candidate1}`
    else if (fs.existsSync(candidate2)) mergedObj.image = `/${candidate2}`
  }
  return mergedObj;
});
// add any extra full entries not in base
for (const f of full) {
  if (f && f.id && !merged.some(x => x.id === f.id)) {
    // If this full entry already contains an image path, keep it only if the file exists.
    if (f.image) {
      const img = String(f.image)
      if (!img.startsWith('http')) {
        const candidate = img.replace(/^\//, '')
        if (fs.existsSync(candidate)) {
          f.image = `/${candidate}`
        } else if (fs.existsSync(`public/${candidate}`)) {
          f.image = `/public/${candidate}`
        } else {
          delete f.image
        }
      }
    } else {
      const c1 = `assets/images/${f.id}.svg`
      const c2 = `public/assets/images/${f.id}.svg`
      if (fs.existsSync(c1)) f.image = `/${c1}`
      else if (fs.existsSync(c2)) f.image = `/${c2}`
    }
    merged.push(f);
  }
}
fs.writeFileSync(fullPath, JSON.stringify(merged, null, 2));
console.log('WROTE', merged.length, 'entries to', fullPath);
