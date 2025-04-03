-- SQL script to add all the required columns for the three-level tagging system
-- Run this in the Supabase SQL Editor

-- Protein category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS protein_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS protein_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS protein_cut text[];

-- Veggie category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS veggie_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS veggie_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS veggie_variety text[];

-- Pantry category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS pantry_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS pantry_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS pantry_variety text[];

-- Dairy category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS dairy_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS dairy_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS dairy_variety text[];

-- Fruit category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fruit_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fruit_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS fruit_variety text[];

-- Cookware category columns
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cookware_category text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cookware_type text[];
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS cookware_variety text[];

-- Custom ingredients column
ALTER TABLE recipes ADD COLUMN IF NOT EXISTS custom_ingredients jsonb;

-- Confirm the columns were added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'recipes' 
AND column_name IN (
  'protein_category', 'protein_type', 'protein_cut',
  'veggie_category', 'veggie_type', 'veggie_variety',
  'pantry_category', 'pantry_type', 'pantry_variety',
  'dairy_category', 'dairy_type', 'dairy_variety',
  'fruit_category', 'fruit_type', 'fruit_variety',
  'cookware_category', 'cookware_type', 'cookware_variety',
  'custom_ingredients'
);
