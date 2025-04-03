-- SQL script to add the three-level tagging columns to the recipes table
-- This script adds columns for both ingredient and cookware tagging

BEGIN;

-- First, check if columns already exist and add them if they don't

-- Protein tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'protein_category') THEN
        ALTER TABLE recipes ADD COLUMN protein_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'protein_type') THEN
        ALTER TABLE recipes ADD COLUMN protein_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'protein_cut') THEN
        ALTER TABLE recipes ADD COLUMN protein_cut TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Veggie tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'veggie_category') THEN
        ALTER TABLE recipes ADD COLUMN veggie_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'veggie_type') THEN
        ALTER TABLE recipes ADD COLUMN veggie_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'veggie_variety') THEN
        ALTER TABLE recipes ADD COLUMN veggie_variety TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Pantry tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'pantry_category') THEN
        ALTER TABLE recipes ADD COLUMN pantry_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'pantry_type') THEN
        ALTER TABLE recipes ADD COLUMN pantry_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'pantry_variety') THEN
        ALTER TABLE recipes ADD COLUMN pantry_variety TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Dairy tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'dairy_category') THEN
        ALTER TABLE recipes ADD COLUMN dairy_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'dairy_type') THEN
        ALTER TABLE recipes ADD COLUMN dairy_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'dairy_variety') THEN
        ALTER TABLE recipes ADD COLUMN dairy_variety TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Fruit tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'fruit_category') THEN
        ALTER TABLE recipes ADD COLUMN fruit_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'fruit_type') THEN
        ALTER TABLE recipes ADD COLUMN fruit_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'fruit_variety') THEN
        ALTER TABLE recipes ADD COLUMN fruit_variety TEXT[] DEFAULT '{}';
    END IF;
END $$;

-- Cookware tagging columns
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cookware_category') THEN
        ALTER TABLE recipes ADD COLUMN cookware_category TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cookware_type') THEN
        ALTER TABLE recipes ADD COLUMN cookware_type TEXT[] DEFAULT '{}';
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'recipes' AND column_name = 'cookware_variety') THEN
        ALTER TABLE recipes ADD COLUMN cookware_variety TEXT[] DEFAULT '{}';
    END IF;
END $$;

COMMIT;
