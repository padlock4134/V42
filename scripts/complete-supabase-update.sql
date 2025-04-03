-- Complete SQL script for updating the Supabase schema and adding functions for the three-level tagging system

-- Step 1: Add all the required columns to the recipes table
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

-- Step 2: Create helper functions for checking and updating columns
-- Function to check if a column exists
CREATE OR REPLACE FUNCTION check_column_exists(p_table_name text, p_column_name text)
RETURNS boolean AS $$
DECLARE
  column_exists boolean;
BEGIN
  SELECT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_name = p_table_name
    AND column_name = p_column_name
  ) INTO column_exists;
  
  RETURN column_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a column
CREATE OR REPLACE FUNCTION add_column(p_table_name text, p_column_name text, p_column_type text)
RETURNS void AS $$
BEGIN
  EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %s', p_table_name, p_column_name, p_column_type);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to generate tags for a recipe (simplified version that can be run in SQL)
CREATE OR REPLACE FUNCTION generate_recipe_tags(recipe_id uuid)
RETURNS void AS $$
DECLARE
  r record;
  ingredient text;
  cookware text;
  protein_found boolean := false;
  veggie_found boolean := false;
  pantry_found boolean := false;
  dairy_found boolean := false;
  fruit_found boolean := false;
  cookware_found boolean := false;
BEGIN
  -- Get the recipe
  SELECT * INTO r FROM recipes WHERE id = recipe_id;
  
  -- Initialize arrays if they're null
  IF r.protein_category IS NULL THEN
    UPDATE recipes SET protein_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.protein_type IS NULL THEN
    UPDATE recipes SET protein_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.protein_cut IS NULL THEN
    UPDATE recipes SET protein_cut = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.veggie_category IS NULL THEN
    UPDATE recipes SET veggie_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.veggie_type IS NULL THEN
    UPDATE recipes SET veggie_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.veggie_variety IS NULL THEN
    UPDATE recipes SET veggie_variety = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.pantry_category IS NULL THEN
    UPDATE recipes SET pantry_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.pantry_type IS NULL THEN
    UPDATE recipes SET pantry_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.pantry_variety IS NULL THEN
    UPDATE recipes SET pantry_variety = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.dairy_category IS NULL THEN
    UPDATE recipes SET dairy_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.dairy_type IS NULL THEN
    UPDATE recipes SET dairy_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.dairy_variety IS NULL THEN
    UPDATE recipes SET dairy_variety = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.fruit_category IS NULL THEN
    UPDATE recipes SET fruit_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.fruit_type IS NULL THEN
    UPDATE recipes SET fruit_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.fruit_variety IS NULL THEN
    UPDATE recipes SET fruit_variety = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.cookware_category IS NULL THEN
    UPDATE recipes SET cookware_category = '{}' WHERE id = recipe_id;
  END IF;
  IF r.cookware_type IS NULL THEN
    UPDATE recipes SET cookware_type = '{}' WHERE id = recipe_id;
  END IF;
  IF r.cookware_variety IS NULL THEN
    UPDATE recipes SET cookware_variety = '{}' WHERE id = recipe_id;
  END IF;
  
  IF r.custom_ingredients IS NULL THEN
    UPDATE recipes SET custom_ingredients = '[]' WHERE id = recipe_id;
  END IF;
  
  -- Process protein tags
  IF r.protein_tags IS NOT NULL THEN
    UPDATE recipes SET protein_category = array_append(protein_category, 'protein') 
    WHERE id = recipe_id AND NOT 'protein' = ANY(protein_category);
    
    -- Add specific protein types based on tags
    IF 'beef' = ANY(r.protein_tags) OR 'steak' = ANY(r.protein_tags) OR 'ground beef' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'beef') 
      WHERE id = recipe_id AND NOT 'beef' = ANY(protein_type);
    END IF;
    
    IF 'chicken' = ANY(r.protein_tags) OR 'poultry' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'chicken') 
      WHERE id = recipe_id AND NOT 'chicken' = ANY(protein_type);
    END IF;
    
    IF 'pork' = ANY(r.protein_tags) OR 'ham' = ANY(r.protein_tags) OR 'bacon' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'pork') 
      WHERE id = recipe_id AND NOT 'pork' = ANY(protein_type);
    END IF;
    
    IF 'fish' = ANY(r.protein_tags) OR 'salmon' = ANY(r.protein_tags) OR 'tuna' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'fish') 
      WHERE id = recipe_id AND NOT 'fish' = ANY(protein_type);
    END IF;
    
    IF 'tofu' = ANY(r.protein_tags) OR 'tempeh' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'tofu') 
      WHERE id = recipe_id AND NOT 'tofu' = ANY(protein_type);
    END IF;
    
    IF 'eggs' = ANY(r.protein_tags) OR 'egg' = ANY(r.protein_tags) THEN
      UPDATE recipes SET protein_type = array_append(protein_type, 'eggs') 
      WHERE id = recipe_id AND NOT 'eggs' = ANY(protein_type);
    END IF;
  END IF;
  
  -- Process veggie tags
  IF r.veggie_tags IS NOT NULL THEN
    UPDATE recipes SET veggie_category = array_append(veggie_category, 'veggies') 
    WHERE id = recipe_id AND NOT 'veggies' = ANY(veggie_category);
    
    -- Add specific veggie types based on tags
    IF 'spinach' = ANY(r.veggie_tags) OR 'kale' = ANY(r.veggie_tags) OR 'lettuce' = ANY(r.veggie_tags) THEN
      UPDATE recipes SET veggie_type = array_append(veggie_type, 'leafy') 
      WHERE id = recipe_id AND NOT 'leafy' = ANY(veggie_type);
    END IF;
    
    IF 'carrot' = ANY(r.veggie_tags) OR 'potato' = ANY(r.veggie_tags) OR 'onion' = ANY(r.veggie_tags) THEN
      UPDATE recipes SET veggie_type = array_append(veggie_type, 'root') 
      WHERE id = recipe_id AND NOT 'root' = ANY(veggie_type);
    END IF;
    
    IF 'broccoli' = ANY(r.veggie_tags) OR 'cauliflower' = ANY(r.veggie_tags) OR 'brussels' = ANY(r.veggie_tags) THEN
      UPDATE recipes SET veggie_type = array_append(veggie_type, 'cruciferous') 
      WHERE id = recipe_id AND NOT 'cruciferous' = ANY(veggie_type);
    END IF;
  END IF;
  
  -- Process required cookware
  IF r.required_cookware IS NOT NULL THEN
    UPDATE recipes SET cookware_category = array_append(cookware_category, 'cookware') 
    WHERE id = recipe_id AND NOT 'cookware' = ANY(cookware_category);
    
    -- Process each cookware item
    FOREACH cookware IN ARRAY r.required_cookware LOOP
      -- Identify cookware types
      IF cookware ILIKE '%pot%' OR cookware ILIKE '%dutch oven%' OR cookware ILIKE '%slow cooker%' THEN
        UPDATE recipes SET cookware_type = array_append(cookware_type, 'pots') 
        WHERE id = recipe_id AND NOT 'pots' = ANY(cookware_type);
      END IF;
      
      IF cookware ILIKE '%pan%' OR cookware ILIKE '%skillet%' OR cookware ILIKE '%wok%' THEN
        UPDATE recipes SET cookware_type = array_append(cookware_type, 'pans') 
        WHERE id = recipe_id AND NOT 'pans' = ANY(cookware_type);
      END IF;
      
      IF cookware ILIKE '%dish%' OR cookware ILIKE '%baking%' OR cookware ILIKE '%casserole%' THEN
        UPDATE recipes SET cookware_type = array_append(cookware_type, 'bakeware') 
        WHERE id = recipe_id AND NOT 'bakeware' = ANY(cookware_type);
      END IF;
      
      IF cookware ILIKE '%knife%' OR cookware ILIKE '%board%' OR cookware ILIKE '%spatula%' OR cookware ILIKE '%whisk%' THEN
        UPDATE recipes SET cookware_type = array_append(cookware_type, 'tools') 
        WHERE id = recipe_id AND NOT 'tools' = ANY(cookware_type);
      END IF;
      
      IF cookware ILIKE '%blender%' OR cookware ILIKE '%processor%' OR cookware ILIKE '%mixer%' THEN
        UPDATE recipes SET cookware_type = array_append(cookware_type, 'appliances') 
        WHERE id = recipe_id AND NOT 'appliances' = ANY(cookware_type);
      END IF;
      
      -- Add the specific cookware variety
      -- Convert cookware to lowercase and replace spaces with underscores
      UPDATE recipes SET cookware_variety = array_append(cookware_variety, lower(regexp_replace(cookware, '\s+', '_', 'g'))) 
      WHERE id = recipe_id AND NOT lower(regexp_replace(cookware, '\s+', '_', 'g')) = ANY(cookware_variety);
    END LOOP;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 3: Function to update all recipes with tags
CREATE OR REPLACE FUNCTION update_all_recipe_tags()
RETURNS void AS $$
DECLARE
  r record;
BEGIN
  FOR r IN SELECT id FROM recipes LOOP
    PERFORM generate_recipe_tags(r.id);
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 4: Verify the columns were added
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

-- Step 5: Run the update function to populate tags for all recipes
-- Uncomment the line below to run the update (might take some time for many recipes)
-- SELECT update_all_recipe_tags();
