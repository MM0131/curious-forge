#!/usr/bin/env bash
set -euo pipefail

# import-photos.sh
# Usage: ./scripts/import-photos.sh [mapping-file] [--no-convert] [--keep-src] [--start-dev]
# mapping-file: CSV with two columns: source_path, dest_basename
#   source_path can be an absolute path or use ~ for home. dest_basename should be like "water-rocket-photo"
# Example mapping file: scripts/image-mapping.csv

ROOT_DIR=$(cd "$(dirname "$0")/.." && pwd)
IMAGES_DIR="$ROOT_DIR/public/assets/images"

MAPPING_FILE=${1:-"$ROOT_DIR/scripts/image-mapping.csv"}
CONVERT=true
KEEP_SRC=false
START_DEV=false

shift || true
while [[ $# -gt 0 ]]; do
  case "$1" in
    --no-convert) CONVERT=false; shift ;;
    --keep-src) KEEP_SRC=true; shift ;;
    --start-dev) START_DEV=true; shift ;;
    *) echo "Unknown arg: $1"; exit 1 ;;
  esac
done

if [[ ! -f "$MAPPING_FILE" ]]; then
  echo "Mapping file not found: $MAPPING_FILE"
  exit 1
fi

mkdir -p "$IMAGES_DIR"

echo "Using mapping file: $MAPPING_FILE"
echo "Images dir: $IMAGES_DIR"
echo "Convert to webp: $CONVERT"
echo "Keep original after convert: $KEEP_SRC"

while IFS=, read -r src dest; do
  # Skip empty/comment lines
  [[ -z "$src" || "$src" =~ ^# ]] && continue

  # Trim whitespace
  src=$(echo "$src" | sed -e 's/^\s*//' -e 's/\s*$//')
  dest=$(echo "$dest" | sed -e 's/^\s*//' -e 's/\s*$//')

  # Expand ~
  eval src_expanded="$src"

  if [[ ! -f "$src_expanded" ]]; then
    echo "Source not found, skipping: $src_expanded"
    continue
  fi

  ext="${src_expanded##*.}"
  dest_path="$IMAGES_DIR/$dest.$ext"

  echo "Copying: $src_expanded -> $dest_path"
  cp -f "$src_expanded" "$dest_path"

  if [[ "$CONVERT" == true ]]; then
    # Convert to webp using node + sharp
    webp_path="$IMAGES_DIR/$dest.webp"
    echo "Converting to webp: $dest_path -> $webp_path"
    node -e "(async()=>{const s=require('sharp'); await s('$dest_path').webp({quality:80}).toFile('$webp_path');})().catch(e=>{console.error('sharp error',e);process.exit(2)})"
    if [[ "$KEEP_SRC" == false ]]; then
      echo "Removing original: $dest_path"
      rm -f "$dest_path"
    fi
  fi
done < "$MAPPING_FILE"

echo "Running link-photos.js to update JSON references..."
node "$ROOT_DIR/scripts/link-photos.js"

if [[ "$START_DEV" == true ]]; then
  echo "Starting dev server (npm run dev) in background..."
  (cd "$ROOT_DIR" && npm run dev) &
fi

echo "Done. Please hard-refresh your browser (Cmd+Shift+R) and check DevTools -> Network for the new images."
