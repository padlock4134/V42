import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to update the Supabase schema to support the three-level tagging system
 */
async function updateSupabaseSchema() {
  try {
    console.log('Starting Supabase schema update...');
    
    // Check connection to Supabase
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      return;
    }
    
    console.log('Connected to Supabase successfully');
    
    // Define the new columns for the three-level tagging system
    const newColumns = [
      // Protein category columns
      { name: 'protein_category', type: 'text[]' },
      { name: 'protein_type', type: 'text[]' },
      { name: 'protein_cut', type: 'text[]' },
      
      // Veggie category columns
      { name: 'veggie_category', type: 'text[]' },
      { name: 'veggie_type', type: 'text[]' },
      { name: 'veggie_variety', type: 'text[]' },
      
      // Pantry category columns
      { name: 'pantry_category', type: 'text[]' },
      { name: 'pantry_type', type: 'text[]' },
      { name: 'pantry_variety', type: 'text[]' },
      
      // Dairy category columns
      { name: 'dairy_category', type: 'text[]' },
      { name: 'dairy_type', type: 'text[]' },
      { name: 'dairy_variety', type: 'text[]' },
      
      // Fruit category columns
      { name: 'fruit_category', type: 'text[]' },
      { name: 'fruit_type', type: 'text[]' },
      { name: 'fruit_variety', type: 'text[]' }
    ];
    
    // Use Supabase's REST API to add columns to the recipes table
    // Note: Supabase doesn't have a direct API for schema modifications,
    // so we'll use PostgreSQL functions through the REST API
    
    console.log('Adding new columns to the recipes table...');
    
    // Create a PostgreSQL function to add the columns if they don't exist
    const createFunctionSQL = `
      CREATE OR REPLACE FUNCTION add_columns_if_not_exist() RETURNS void AS $$
      DECLARE
        column_exists boolean;
      BEGIN
        ${newColumns.map(column => `
          SELECT EXISTS (
            SELECT FROM information_schema.columns 
            WHERE table_name = 'recipes' AND column_name = '${column.name}'
          ) INTO column_exists;
          
          IF NOT column_exists THEN
            EXECUTE 'ALTER TABLE recipes ADD COLUMN ${column.name} ${column.type} DEFAULT NULL';
            RAISE NOTICE 'Added column ${column.name}';
          ELSE
            RAISE NOTICE 'Column ${column.name} already exists';
          END IF;
        `).join('\n')}
      END;
      $$ LANGUAGE plpgsql;
    `;
    
    // Execute the function to add columns
    const executeFunctionSQL = `
      SELECT add_columns_if_not_exist();
    `;
    
    // Drop the function after use
    const dropFunctionSQL = `
      DROP FUNCTION IF EXISTS add_columns_if_not_exist();
    `;
    
    // Execute the SQL statements using Supabase's rpc function
    const { error: createFunctionError } = await supabase.rpc('exec_sql', { sql: createFunctionSQL });
    if (createFunctionError) {
      console.error('Error creating function:', createFunctionError);
      
      // Alternative approach: use direct SQL if rpc is not available
      console.log('Attempting direct SQL approach...');
      
      // For each column, we'll need to check if it exists and add it if it doesn't
      for (const column of newColumns) {
        try {
          // Check if column exists
          const { data, error } = await supabase
            .from('recipes')
            .select(column.name)
            .limit(1);
          
          if (error && error.message && error.message.includes('does not exist')) {
            console.log(`Column ${column.name} does not exist. Adding it...`);
            
            // Since we can't directly alter the table through the REST API,
            // we'll need to use a database migration or the Supabase dashboard
            console.log(`Please add column ${column.name} of type ${column.type} to the recipes table using the Supabase dashboard.`);
          } else {
            console.log(`Column ${column.name} already exists.`);
          }
        } catch (err) {
          console.error(`Error checking column ${column.name}:`, err);
        }
      }
      
      console.log('Schema update instructions complete. Please update the schema manually if needed.');
      return;
    }
    
    const { error: executeFunctionError } = await supabase.rpc('exec_sql', { sql: executeFunctionSQL });
    if (executeFunctionError) {
      console.error('Error executing function:', executeFunctionError);
    } else {
      console.log('Successfully added new columns to the recipes table');
    }
    
    const { error: dropFunctionError } = await supabase.rpc('exec_sql', { sql: dropFunctionSQL });
    if (dropFunctionError) {
      console.error('Error dropping function:', dropFunctionError);
    }
    
    console.log('Supabase schema update completed successfully!');
    console.log('You can now run the update-recipe-tags.js script to populate the new columns with tag data.');
  } catch (error) {
    console.error('Error in updateSupabaseSchema:', error);
    console.log('Please update the schema manually using the Supabase dashboard if needed.');
  }
}

// Run the function
updateSupabaseSchema();
