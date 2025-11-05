#!/usr/bin/env node

// scripts/link-photos.js
// Scan public/assets/images for files named like <id>-photo.jpg and update
// assets/data/blueprints.json and public/assets/data/blueprints.json to point to them.

const fs = require('fs');
const path = require('path');

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function writeJson(filePath, obj) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

function main() {
  const repoRoot = path.join(__dirname, '..');
  const imageDir = path.join(repoRoot, 'public', 'assets', 'images');
  const assetsJson = path.join(repoRoot, 'assets', 'data', 'blueprints.json');
  const publicJson = path.join(repoRoot, 'public', 'assets', 'data', 'blueprints.json');

  if (!fs.existsSync(imageDir)) {
    console.error('Image folder not found:', imageDir);
    process.exit(2);
  }

  const files = fs.readdirSync(imageDir);
  const photoFiles = files.filter(f => /(.+)-photo\.(jpg|jpeg|png|webp|gif)$/i.test(f));

  if (photoFiles.length === 0) {
    console.log('No photo files found in', imageDir);
    process.exit(0);
  }

  console.log('Found photo files:', photoFiles);

  // Load both JSON files
  let assetsData, publicData;
  try {
    assetsData = readJson(assetsJson);
  } catch (e) {
    console.error('Failed to read', assetsJson, e.message);
    process.exit(3);
  }
  try {
    publicData = readJson(publicJson);
  } catch (e) {
    console.error('Failed to read', publicJson, e.message);
    process.exit(3);
  }

  const changes = [];

  photoFiles.forEach(filename => {
    const match = filename.match(/(.+)-photo\.(jpg|jpeg|png|webp|gif)$/i);
    if (!match) return;
    const id = match[1];
    const relativePath = '/assets/images/' + filename;

    const updateInArray = (arr) => {
      const idx = arr.findIndex(b => b.id === id);
      if (idx !== -1) {
        if (arr[idx].image !== relativePath) {
          const old = arr[idx].image;
          arr[idx].image = relativePath;
          return { id, file: idx, old, updated: relativePath };
        }
        return null; // already set
      }
      return { id, missing: true };
    };

    const res1 = updateInArray(assetsData);
    const res2 = updateInArray(publicData);

    if (res1 && res1.missing && res2 && res2.missing) {
      console.warn(`No blueprint with id='${id}' found in either JSON. Skipping ${filename}`);
    } else {
      changes.push({ filename, result: { assets: res1, public: res2 } });
    }
  });

  if (changes.length === 0) {
    console.log('No changes to write. Exiting.');
    process.exit(0);
  }

  // Backup existing JSONs
  try {
    fs.copyFileSync(assetsJson, assetsJson + '.bak');
    fs.copyFileSync(publicJson, publicJson + '.bak');
    console.log('Backed up JSON files to .bak');
  } catch (e) {
    console.warn('Failed to backup JSON files, continuing:', e.message);
  }

  // Write updated JSON
  try {
    writeJson(assetsJson, assetsData);
    writeJson(publicJson, publicData);
    console.log('Updated JSON files successfully.');
  } catch (e) {
    console.error('Failed to write JSON files:', e.message);
    process.exit(4);
  }

  console.log('Summary of changes:');
  changes.forEach(c => {
    console.log('-', c.filename, JSON.stringify(c.result));
  });

  console.log('\nDone. Now make sure the files are present in public/assets/images/ (they should be). Restart dev server or hard-refresh the page to see changes.');
}

if (require.main === module) {
  main();
}
