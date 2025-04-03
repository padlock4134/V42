import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to specifically fix the Mansaf recipe with null name
 */
async function fixMansafRecipe() {
  try {
    console.log('Starting Mansaf recipe fix...');
    
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
    
    // Find the Mansaf recipe - we'll try different approaches
    // First, look for a recipe with "Mansaf" in the ingredients or description
    const { data: mansafByIngredients, error: ingredientsError } = await supabase
      .from('recipes')
      .select('*')
      .or('description.ilike.%Mansaf%,ingredients.cs.{%Mansaf%}');
    
    if (ingredientsError) {
      console.error('Error searching for Mansaf recipe:', ingredientsError);
    }
    
    let mansafRecipe = null;
    
    if (mansafByIngredients && mansafByIngredients.length > 0) {
      mansafRecipe = mansafByIngredients[0];
      console.log(`Found Mansaf recipe by ingredients/description: ${mansafRecipe.id}`);
    } else {
      // Try to find any recipe with a null name
      const { data: nullNameRecipes, error: nullNameError } = await supabase
        .from('recipes')
        .select('*')
        .is('name', null);
      
      if (nullNameError) {
        console.error('Error searching for recipes with null names:', nullNameError);
      } else if (nullNameRecipes && nullNameRecipes.length > 0) {
        mansafRecipe = nullNameRecipes[0];
        console.log(`Found recipe with null name: ${mansafRecipe.id}`);
      }
    }
    
    if (!mansafRecipe) {
      // Last resort - try to find the recipe by ID if we know it
      // This is a placeholder ID - replace with the actual ID if known
      const mansafId = '9d562-3038-4e4e-8e72-85fa66c20ea5'; // This might be part of the ID from the error message
      
      const { data: recipeById, error: idError } = await supabase
        .from('recipes')
        .select('*')
        .like('id', `%${mansafId}%`);
      
      if (idError) {
        console.error('Error searching for Mansaf recipe by ID:', idError);
      } else if (recipeById && recipeById.length > 0) {
        mansafRecipe = recipeById[0];
        console.log(`Found recipe by partial ID: ${mansafRecipe.id}`);
      }
    }
    
    if (mansafRecipe) {
      // Update the recipe name to "Mansaf"
      const { data: updateData, error: updateError } = await supabase
        .from('recipes')
        .update({ name: 'Mansaf' })
        .eq('id', mansafRecipe.id);
      
      if (updateError) {
        console.error('Error updating Mansaf recipe:', updateError);
      } else {
        console.log(`Successfully updated recipe name to "Mansaf" for ID: ${mansafRecipe.id}`);
      }
    } else {
      console.log('Could not find the Mansaf recipe or any recipe with a null name.');
      
      // Alternative approach - update all recipes with null names
      console.log('Attempting to update all recipes with null names...');
      
      const { data: updateAllData, error: updateAllError } = await supabase
        .from('recipes')
        .update({ name: 'Mansaf' })
        .is('name', null);
      
      if (updateAllError) {
        console.error('Error updating recipes with null names:', updateAllError);
      } else {
        console.log('Update for null name recipes completed:', updateAllData);
      }
    }
    
    console.log('Mansaf recipe fix attempt completed!');
  } catch (error) {
    console.error('Error in fixMansafRecipe:', error);
  }
}

// Run the function
fixMansafRecipe();
