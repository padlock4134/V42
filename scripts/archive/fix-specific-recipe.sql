-- SQL script to fix the specific recipe with ID 0105782c-3e89-4899-8593-25d9edb49765
BEGIN;

-- Update the specific recipe with null name
UPDATE recipes
SET name = 'Unknown Recipe'
WHERE id = '0105782c-3e89-4899-8593-25d9edb49765';

-- Also update any other recipe with a null name (as a safety measure)
UPDATE recipes
SET name = 'Unknown Recipe'
WHERE name IS NULL;

COMMIT;
