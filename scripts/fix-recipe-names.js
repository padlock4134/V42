import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to fix recipes with null names in the database
 */
async function fixRecipeNames() {
  try {
    console.log('Starting recipe name fix...');
    
    // Check Supabase connection
    const { data: testData, error: testError } = await supabase
      .from('recipes')
      .select('id')
      .limit(1);
    
    if (testError) {
      console.error('Error connecting to Supabase:', testError);
      return;
    }
    
    console.log('Connected to Supabase successfully');
    
    // Get all recipes with null names
    const { data: recipesWithNullNames, error: recipesError } = await supabase
      .from('recipes')
      .select('*')
      .is('name', null);
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipesWithNullNames.length} recipes with null names`);
    
    // Fix each recipe with a null name
    for (const recipe of recipesWithNullNames) {
      console.log(`Fixing recipe with ID: ${recipe.id}`);
      
      // Determine a name for the recipe based on its ingredients or other properties
      let recipeName = 'Unknown Recipe';
      
      // If we have ingredients, use the first few to create a name
      if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
        const mainIngredients = recipe.ingredients.slice(0, 3);
        recipeName = mainIngredients.join(', ') + ' Recipe';
      }
      
      // Special case for Mansaf
      if (recipe.id === '17562-3038-4e4e-8e72-85fa66c20ea5') {
        recipeName = 'Mansaf';
      }
      
      // Update the recipe with the new name
      const { error: updateError } = await supabase
        .from('recipes')
        .update({ name: recipeName })
        .eq('id', recipe.id);
      
      if (updateError) {
        console.error(`Error updating recipe ${recipe.id}:`, updateError);
      } else {
        console.log(`Updated recipe ${recipe.id} with name: ${recipeName}`);
      }
    }
    
    console.log('Recipe name fix completed!');
  } catch (error) {
    console.error('Error in fixRecipeNames:', error);
  }
}

// Run the function
fixRecipeNames();
