const fs = require('fs');
const full = JSON.parse(fs.readFileSync('assets/data/blueprints.en.full.json','utf8'));
for (const b of full) {
  if (b.image) {
    const p = String(b.image).replace(/^\//,'');
    if (!p.startsWith('http')) {
      if (!fs.existsSync(p) && !fs.existsSync('public/'+p)) {
        console.log('MISSING IMAGE FILE for', b.id, '->', b.image)
      }
    }
  }
}
