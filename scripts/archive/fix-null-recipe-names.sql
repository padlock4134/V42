-- Create a function to fix null recipe names
CREATE OR REPLACE FUNCTION fix_null_recipe_names(default_name text)
RETURNS text AS $$
DECLARE
  affected_rows integer;
BEGIN
  -- Update any recipes with null names
  UPDATE recipes
  SET name = COALESCE(default_name, 'Unknown Recipe')
  WHERE name IS NULL;
  
  -- Get the number of affected rows
  GET DIAGNOSTICS affected_rows = ROW_COUNT;
  
  RETURN 'Updated ' || affected_rows || ' recipes with null names';
END;
$$ LANGUAGE plpgsql;
