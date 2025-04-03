import { exec } from 'child_process';
import { promisify } from 'util';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const execPromise = promisify(exec);

/**
 * Main function to run the Supabase schema update and tag update scripts
 */
async function updateRecipeTagging() {
  try {
    console.log('Starting recipe tagging system update...');
    
    // Check if Supabase credentials are available
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
      console.error('Error: Supabase credentials not found in environment variables.');
      console.log('Please make sure SUPABASE_URL and SUPABASE_ANON_KEY are set in your .env file.');
      return;
    }
    
    // Step 1: Update the Supabase schema
    console.log('\n--- Step 1: Updating Supabase Schema ---');
    try {
      const { stdout: schemaOutput, stderr: schemaError } = await execPromise('node scripts/update-supabase-schema.js');
      console.log(schemaOutput);
      if (schemaError) console.error(schemaError);
    } catch (error) {
      console.error('Error running schema update script:', error.message);
      console.log('\nSchema update encountered errors. You may need to manually add the following columns to your Supabase recipes table:');
      console.log('- protein_category (type: text[])');
      console.log('- protein_type (type: text[])');
      console.log('- protein_cut (type: text[])');
      console.log('- veggie_category (type: text[])');
      console.log('- veggie_type (type: text[])');
      console.log('- veggie_variety (type: text[])');
      console.log('- pantry_category (type: text[])');
      console.log('- pantry_type (type: text[])');
      console.log('- pantry_variety (type: text[])');
      console.log('- dairy_category (type: text[])');
      console.log('- dairy_type (type: text[])');
      console.log('- dairy_variety (type: text[])');
      console.log('- fruit_category (type: text[])');
      console.log('- fruit_type (type: text[])');
      console.log('- fruit_variety (type: text[])');
      console.log('\nYou can add these columns through the Supabase dashboard in the Table Editor.');
      console.log('Continuing to next step...');
    }
    
    // Step 2: Update the recipe tags
    console.log('\n--- Step 2: Updating Recipe Tags ---');
    try {
      const { stdout: tagsOutput, stderr: tagsError } = await execPromise('node scripts/update-recipe-tags.js');
      console.log(tagsOutput);
      if (tagsError) console.error(tagsError);
    } catch (error) {
      console.error('Error running tag update script:', error.message);
      console.log('\nTag update encountered errors. You may need to manually update the tags for your recipes.');
      console.log('The recipe matching will still work with the existing tags, but the three-level matching will be limited.');
    }
    
    console.log('\nRecipe tagging system update process completed!');
    console.log('\nIf you encountered errors, you can:');
    console.log('1. Check your Supabase credentials in the .env file');
    console.log('2. Manually add the columns listed above through the Supabase dashboard');
    console.log('3. Run this script again after fixing any issues');
    
    console.log('\nThe following new tag fields have been added (or attempted to be added) to your recipes:');
    console.log('- Protein: protein_category, protein_type, protein_cut');
    console.log('- Veggies: veggie_category, veggie_type, veggie_variety');
    console.log('- Pantry: pantry_category, pantry_type, pantry_variety');
    console.log('- Dairy: dairy_category, dairy_type, dairy_variety');
    console.log('- Fruit: fruit_category, fruit_type, fruit_variety');
    
    console.log('\nTo test the new tagging system, try selecting ingredients in the Kitchen page and see how the recipe matching has improved!');
  } catch (error) {
    console.error('Error in updateRecipeTagging:', error);
  }
}

// Run the function
updateRecipeTagging();
