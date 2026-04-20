-- Migration: Add slug column to blueprints and populate from title
-- Run this in Supabase SQL Editor or as part of your migration pipeline

BEGIN;

-- Add slug column if it does not exist
ALTER TABLE public.blueprints
  ADD COLUMN IF NOT EXISTS slug TEXT;

-- Create unique index on slug
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'blueprints' AND indexname = 'idx_blueprints_slug'
  ) THEN
    CREATE INDEX idx_blueprints_slug ON public.blueprints (slug);
  END IF;
END$$;

-- Normalize title to a safe slug for existing rows which lack slug
-- This uses a simple transliteration and regexp replacement to convert to ascii-like slug
UPDATE public.blueprints
SET slug = lower(regexp_replace(regexp_replace(title, '[^a-zA-Z0-9]+', '-', 'g'), '(^-|-$)', '', 'g'))
WHERE slug IS NULL OR slug = '';

-- Enforce uniqueness constraint if not present (note: will fail if duplicates exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_blueprints_slug'
  ) THEN
    BEGIN
      ALTER TABLE public.blueprints ADD CONSTRAINT uq_blueprints_slug UNIQUE (slug);
    EXCEPTION WHEN unique_violation THEN
      -- If uniqueness constraint cannot be created due to duplicates, leave it to the operator to resolve
      RAISE NOTICE 'Could not add unique constraint uq_blueprints_slug: duplicates exist. Resolve duplicates and re-run migration to enforce uniqueness.';
    END;
  END IF;
END$$;

COMMIT;

-- Notes:
-- 1) This migration attempts to set a slug derived from the title for existing rows.
-- 2) If you instead want to populate slugs from your canonical assets/data files (preferred when you have stable IDs), run the provided script `scripts/import-slugs.mjs` which will update slug values using the dataset ids.
