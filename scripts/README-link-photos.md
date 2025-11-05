How to automatically link photo files to blueprints

This small helper scans `public/assets/images/` for files named like:

  <blueprint-id>-photo.jpg
  <blueprint-id>-photo.png

For each matching file the script updates:

  - `assets/data/blueprints.json`
  - `public/assets/data/blueprints.json`

so the `image` field for the blueprint with id `<blueprint-id>` is set to `/assets/images/<filename>`.

Usage

1. Copy your photo(s) into `public/assets/images/`. Name them using blueprint id + `-photo` suffix. Example:

   public/assets/images/solar-still-photo.jpg

2. Run the script from the repo root:

```bash
node scripts/link-photos.js
```

3. Restart dev server (if running) and hard-refresh the page to see the new thumbnail.

Notes

- The script makes `.bak` backups of the JSON files before modifying them.
- If no blueprint with the parsed id is found the file will be skipped and a warning printed.
- If you'd like the script to copy files from an `uploads/` folder or rename uploaded files automatically, I can extend it.
