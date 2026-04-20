#!/usr/bin/env node

// scripts/download-photos.js
// Usage:
//  node scripts/download-photos.js '{"solar-still":"https://...", "microbial-fuel-cell":"https://..."}'
// or
//  node scripts/download-photos.js ./scripts/photo-urls.json
//
// The script downloads each URL and saves it to public/assets/images/<id>-photo.<ext>
// Then it runs the link-photos script to update blueprint JSON files.

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to download ${url}: ${res.status} ${res.statusText}`);
  const buffer = await res.arrayBuffer();
  fs.writeFileSync(dest, Buffer.from(buffer));
}

function getExtFromContentType(ct) {
  if (!ct) return 'jpg';
  if (ct.includes('png')) return 'png';
  if (ct.includes('webp')) return 'webp';
  if (ct.includes('gif')) return 'gif';
  return 'jpg';
}

async function main() {
  const repoRoot = path.join(__dirname, '..');
  const imagesDir = path.join(repoRoot, 'public', 'assets', 'images');

  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  if (process.argv.length < 3) {
    console.error('Usage: node scripts/download-photos.js <json-mapping-or-file>');
    console.error('Example: node scripts/download-photos.js "{\"solar-still\":\"https://...\"}"');
    process.exit(1);
  }

  let mappingArg = process.argv[2];
  let mapping = null;
  try {
    if (fs.existsSync(mappingArg)) {
      mapping = JSON.parse(fs.readFileSync(mappingArg, 'utf8'));
    } else {
      mapping = JSON.parse(mappingArg);
    }
  } catch (e) {
    console.error('Failed to parse mapping JSON:', e.message);
    process.exit(2);
  }

  const entries = Object.entries(mapping);
  if (entries.length === 0) {
    console.log('No entries in mapping. Nothing to do.');
    process.exit(0);
  }

  console.log('Will download', entries.length, 'images...');

  for (const [id, url] of entries) {
    try {
      console.log('Downloading', id, url);
      const res = await fetch(url, { redirect: 'follow' });
      if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
      const ct = res.headers.get('content-type') || '';
      const ext = getExtFromContentType(ct) || 'jpg';
      const filename = `${id}-photo.${ext}`;
      const dest = path.join(imagesDir, filename);
      const buffer = await res.arrayBuffer();
      fs.writeFileSync(dest, Buffer.from(buffer));
      console.log('Saved to', dest);
    } catch (err) {
      console.error('Failed to download', id, url, err.message);
    }
  }

  // Run link-photos to update JSON files
  console.log('Running link-photos script to update blueprint metadata...');
  const cmd = process.platform === 'win32' ? 'node' : 'node';
  const proc = spawnSync(cmd, ['scripts/link-photos.js'], { stdio: 'inherit' });
  if (proc.error) {
    console.error('Failed to run link-photos.js:', proc.error.message);
    process.exit(3);
  }

  console.log('Done. Restart dev server or hard-refresh pages to see updated thumbnails.');
}

// Node's global fetch is available in Node 18+. If not, instruct the user to run with Node 18+ or install node-fetch.
if (typeof fetch === 'undefined') {
  console.error('Global fetch is not available in this Node runtime. Please run with Node 18+ or install a fetch polyfill.');
  process.exit(4);
}

main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
