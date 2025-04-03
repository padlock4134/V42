-- SQL script to fix recipes with null names, accounting for case sensitivity
BEGIN;

-- Update any recipes with null names to 'Unknown Recipe'
UPDATE recipes
SET "Name" = 'Unknown Recipe'
WHERE "Name" IS NULL;

COMMIT;
