-- Migration: Add external_id column to blueprints for dataset mapping
-- Run in Supabase SQL Editor or migration pipeline

BEGIN;

ALTER TABLE public.blueprints
  ADD COLUMN IF NOT EXISTS external_id TEXT;

-- Create index for faster lookup
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE tablename = 'blueprints' AND indexname = 'idx_blueprints_external_id'
  ) THEN
    CREATE INDEX idx_blueprints_external_id ON public.blueprints (external_id);
  END IF;
END$$;

-- Add unique constraint on external_id to allow safe upserts by external id
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'uq_blueprints_external_id'
  ) THEN
    BEGIN
      ALTER TABLE public.blueprints ADD CONSTRAINT uq_blueprints_external_id UNIQUE (external_id);
    EXCEPTION WHEN unique_violation THEN
      RAISE NOTICE 'Cannot add unique constraint uq_blueprints_external_id: duplicate external_id values exist. Resolve duplicates first.';
    END;
  END IF;
END$$;

COMMIT;

-- Notes:
-- 1) `external_id` is intended to store canonical dataset ids (e.g., 'volcano', 'analog-weather-station').
-- 2) After running this migration, use the script `scripts/upsert-blueprints-by-external-id.mjs` to push dataset rows into the DB and set `external_id`/`slug` values.
