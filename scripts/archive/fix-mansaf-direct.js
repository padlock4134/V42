import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to directly fix the Mansaf recipe with null name using a more targeted approach
 */
async function fixMansafDirect() {
  try {
    console.log('Starting direct Mansaf recipe fix...');
    
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
    
    // Get all recipes to find the problematic one
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*');
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipes.length} total recipes`);
    
    // Find recipes with null or undefined names
    const problematicRecipes = recipes.filter(recipe => !recipe.name);
    console.log(`Found ${problematicRecipes.length} recipes with null/undefined names`);
    
    if (problematicRecipes.length > 0) {
      for (const recipe of problematicRecipes) {
        console.log(`Fixing recipe with ID: ${recipe.id}`);
        
        // Set the name to "Mansaf" for the problematic recipe
        const { data: updateData, error: updateError } = await supabase
          .from('recipes')
          .update({ name: 'Mansaf' })
          .eq('id', recipe.id);
        
        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError);
        } else {
          console.log(`Successfully updated recipe name to "Mansaf" for ID: ${recipe.id}`);
        }
      }
    } else {
      console.log('No recipes with null names found in the initial scan.');
      
      // As a fallback, try to identify the Mansaf recipe by looking at the error message
      const partialId = '562-3038-4e4e-8e72-85fa66c20ea5';
      
      // Find any recipe with an ID containing this partial string
      const possibleMatches = recipes.filter(recipe => 
        recipe.id && recipe.id.toString().includes(partialId)
      );
      
      if (possibleMatches.length > 0) {
        console.log(`Found ${possibleMatches.length} possible matches by partial ID`);
        
        for (const match of possibleMatches) {
          console.log(`Updating possible match: ${match.id}`);
          
          // Update the name to "Mansaf"
          const { data: updateData, error: updateError } = await supabase
            .from('recipes')
            .update({ name: match.name || 'Mansaf' })
            .eq('id', match.id);
          
          if (updateError) {
            console.error(`Error updating recipe ${match.id}:`, updateError);
          } else {
            console.log(`Successfully updated recipe for ID: ${match.id}`);
          }
        }
      } else {
        console.log('No matches found by partial ID.');
      }
    }
    
    console.log('Direct Mansaf recipe fix completed!');
  } catch (error) {
    console.error('Error in fixMansafDirect:', error);
  }
}

// Run the function
fixMansafDirect();
