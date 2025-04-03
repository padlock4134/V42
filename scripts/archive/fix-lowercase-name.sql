-- SQL script to fix recipes with null names (lowercase)
BEGIN;

-- Update any recipes with null names to 'Unknown Recipe'
UPDATE recipes
SET name = 'Unknown Recipe'
WHERE name IS NULL;

COMMIT;
