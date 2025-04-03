import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to fix all recipes with null names in the database
 * This script uses a more comprehensive approach to identify and fix all problematic recipes
 */
async function fixAllNullNames() {
  try {
    console.log('Starting comprehensive null name fix...');
    
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
    
    // Get all recipes to examine
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*');
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipes.length} total recipes`);
    
    // Track problematic recipes
    const problematicRecipes = [];
    
    // Check each recipe for null or undefined name
    for (const recipe of recipes) {
      if (!recipe.name) {
        problematicRecipes.push(recipe);
      }
    }
    
    console.log(`Found ${problematicRecipes.length} recipes with null/undefined names`);
    
    // Also check for the specific recipe IDs from error messages
    const knownProblematicIds = [
      'b3918562-3038-4e4e-8e72-85fa66c20ea5', // Mansaf
      '691-83da-4509-8d06-c8e53e583f6e' // From the latest error message
    ];
    
    for (const id of knownProblematicIds) {
      // Find any recipe with an ID containing this partial string
      const matches = recipes.filter(recipe => 
        recipe.id && recipe.id.toString().includes(id) && !problematicRecipes.includes(recipe)
      );
      
      if (matches.length > 0) {
        console.log(`Found ${matches.length} matches for problematic ID: ${id}`);
        problematicRecipes.push(...matches);
      }
    }
    
    // Fix all identified problematic recipes
    if (problematicRecipes.length > 0) {
      console.log(`Fixing ${problematicRecipes.length} problematic recipes`);
      
      for (const recipe of problematicRecipes) {
        // Determine a name for the recipe based on its ingredients or ID
        let recipeName = 'Unknown Recipe';
        
        // Check if it's the Mansaf recipe
        if (recipe.id && recipe.id.toString().includes('b3918562-3038')) {
          recipeName = 'Mansaf';
        } 
        // Try to determine name from ingredients
        else if (Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0) {
          const mainIngredients = recipe.ingredients.slice(0, 2);
          if (typeof mainIngredients[0] === 'string') {
            recipeName = `${mainIngredients[0]} Recipe`;
          } else if (mainIngredients[0] && mainIngredients[0].name) {
            recipeName = `${mainIngredients[0].name} Recipe`;
          }
        }
        
        console.log(`Fixing recipe ${recipe.id} with name: ${recipeName}`);
        
        // Update the recipe name
        const { data: updateData, error: updateError } = await supabase
          .from('recipes')
          .update({ name: recipeName })
          .eq('id', recipe.id);
        
        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError);
        } else {
          console.log(`Successfully updated recipe name to "${recipeName}" for ID: ${recipe.id}`);
        }
      }
    } else {
      console.log('No problematic recipes found to fix.');
      
      // As a last resort, try a direct SQL approach
      console.log('Attempting direct update for any recipes with null names...');
      
      // Use a raw SQL query through Supabase
      const { data: rawData, error: rawError } = await supabase.rpc('update_null_names', {
        default_name: 'Unknown Recipe'
      });
      
      if (rawError) {
        console.error('Error with direct SQL update:', rawError);
        
        // Try an alternative approach with a direct update
        const { data: directData, error: directError } = await supabase
          .from('recipes')
          .update({ name: 'Unknown Recipe' })
          .is('name', null);
        
        if (directError) {
          console.error('Error with direct update:', directError);
        } else {
          console.log('Direct update completed:', directData);
        }
      } else {
        console.log('Raw SQL update completed:', rawData);
      }
    }
    
    console.log('Comprehensive null name fix completed!');
  } catch (error) {
    console.error('Error in fixAllNullNames:', error);
  }
}

// Run the function
fixAllNullNames();
