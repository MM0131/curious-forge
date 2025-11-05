Download photos and link them to blueprints

This helper downloads remote images and links them to blueprint entries.

Usage examples:

1) Pass a JSON mapping inline:

  node scripts/download-photos.js '{"solar-still":"https://...","microbial-fuel-cell":"https://..."}'

2) Put mapping in a file and pass the file path:

  // scripts/photo-urls.json
  {
    "solar-still": "https://...",
    "microbial-fuel-cell": "https://..."
  }

  node scripts/download-photos.js scripts/photo-urls.json

Notes:
- The script saves files to `public/assets/images/<id>-photo.<ext>` (extension inferred from Content-Type).
- It then runs `scripts/link-photos.js` to update `assets/data/blueprints.json` and `public/assets/data/blueprints.json`.
- Requires Node 18+ (global fetch). If your Node doesn't have fetch, run under Node 18+ or install a fetch polyfill.
- After running, restart dev server or hard-refresh pages to see new thumbnails.
