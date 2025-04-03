-- SQL script to fix all recipes with null names
BEGIN;

-- Update any recipes with null names to 'Unknown Recipe'
UPDATE recipes
SET name = 'Unknown Recipe'
WHERE name IS NULL;

COMMIT;
