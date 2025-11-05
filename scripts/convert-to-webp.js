#!/usr/bin/env node
/* eslint-disable complexity, unicorn/prefer-top-level-await, sonarjs/cognitive-complexity */
const fs = require('node:fs')
const path = require('node:path')
const sharp = require('sharp')

async function convert(inputPath, outPath, quality = 80) {
  await sharp(inputPath)
    .webp({ quality })
    .toFile(outPath)
}

async function main() {
  const mapFile = process.argv[2] || path.join(__dirname, 'mapping.json')
  if (!fs.existsSync(mapFile)) {
    console.error('Mapping file not found:', mapFile)
    console.error('Create a mapping.json in scripts/ or pass a path: node scripts/convert-to-webp.js <mapping.json>')
    process.exit(1)
  }

  let mapping
  try {
    mapping = JSON.parse(fs.readFileSync(mapFile, 'utf8'))
  } catch (err) {
    console.error('Failed to read mapping JSON:', err.message)
    process.exit(1)
  }

  const outDir = path.join(process.cwd(), 'public', 'assets', 'images')
  fs.mkdirSync(outDir, { recursive: true })

  let success = 0
  let failed = 0

  // Support two mapping formats:
  // 1) legacy: { source: 'path', dest: 'name.webp', quality: 80 }
  // 2) preferred: { id: 'solar-still', src: 'scripts/originals/..', alt: 'alt text', quality: 80 }
  const convertedMeta = []
  for (const item of mapping) {
    let src, destName, quality
    if (item.source && item.dest) {
      // legacy
      src = path.isAbsolute(item.source) ? item.source : path.join(process.cwd(), item.source)
      destName = item.dest
      quality = item.quality || 80
    } else if (item.src && item.id) {
      src = path.isAbsolute(item.src) ? item.src : path.join(process.cwd(), item.src)
      destName = `${item.id}-photo.webp`
      quality = item.quality || 80
    } else {
      console.error('Invalid mapping entry (missing source/dest or id/src):', JSON.stringify(item))
      failed++
      continue
    }

    const dest = path.join(outDir, destName)

    if (!fs.existsSync(src)) {
      console.error('Missing source file, skipping:', src)
      failed++
      continue
    }

    try {
      await convert(src, dest, quality)
      console.log('Converted:', src, '->', dest)
      success++
      convertedMeta.push({ id: item.id || null, dest: `/assets/images/${destName}`, alt: item.alt || null })
    } catch (err) {
      console.error('Conversion failed for', src, err.message)
      failed++
    }
  }

  // Write a small metadata file so downstream scripts or manual steps can pick up alts / ids
  if (convertedMeta.length > 0) {
    try {
      const metaPath = path.join(process.cwd(), 'scripts', 'converted-images.json')
      fs.writeFileSync(metaPath, JSON.stringify(convertedMeta, null, 2), 'utf8')
      console.log('Wrote converted metadata to', metaPath)
    } catch (err) {
      console.error('Failed to write converted metadata:', err.message)
    }
  }

  console.log(`\nDone. Success: ${success}, Failed: ${failed}`)
  if (failed > 0) process.exit(2)
}

;(async () => {
  try {
    await main()
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
})()
