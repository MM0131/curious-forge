/* eslint-disable @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars */
const sharp = require('sharp');
const path = require('path');
const inPath = path.join(process.cwd(), 'public', 'assets', 'images', 'lemon-battery-photo.svg');
const outPath = path.join(process.cwd(), 'public', 'assets', 'images', 'lemon-battery-photo.webp');

sharp(inPath)
  .webp({ quality: 80 })
  .toFile(outPath)
  .then(() => console.log('converted to', outPath))
  .catch(err => { console.error('convert failed', err); process.exit(1) });
