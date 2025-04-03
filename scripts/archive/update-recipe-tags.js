import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to update recipe tags in Supabase with more detailed three-level tagging
 */
async function updateRecipeTags() {
  try {
    console.log('Starting recipe tag update...');
    
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
    
    // Get all recipes
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*');
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipes.length} recipes to update`);
    
    // Define the three-level tagging structure based on the Kitchen component
    const tagStructure = {
      protein: {
        beef: ['ground', 'steak', 'roast', 'ribs', 'brisket', 'other'],
        chicken: ['breast', 'thigh', 'drumstick', 'wing', 'whole', 'ground'],
        pork: ['chop', 'loin', 'shoulder', 'belly', 'ground', 'ribs'],
        fish: ['salmon', 'tuna', 'cod', 'tilapia', 'halibut', 'other'],
        tofu: ['firm', 'silken', 'extra-firm', 'smoked', 'fried', 'other'],
        eggs: ['whole', 'white', 'yolk', 'boiled', 'poached', 'other']
      },
      veggies: {
        leafy: ['spinach', 'kale', 'lettuce', 'arugula', 'chard', 'cabbage'],
        root: ['carrot', 'potato', 'onion', 'radish', 'beet', 'turnip'],
        cruciferous: ['broccoli', 'cauliflower', 'brussels', 'kohlrabi', 'bokchoy', 'collard'],
        squash: ['zucchini', 'butternut', 'acorn', 'spaghetti', 'pumpkin', 'yellow'],
        peppers: ['bell', 'jalapeno', 'habanero', 'serrano', 'poblano', 'cayenne'],
        alliums: ['onion', 'garlic', 'shallot', 'leek', 'scallion', 'chive']
      },
      pantry: {
        grains: ['rice', 'quinoa', 'barley', 'farro', 'oats', 'bulgur'],
        pasta: ['spaghetti', 'penne', 'fettuccine', 'macaroni', 'lasagna', 'orzo'],
        canned: ['beans', 'tomatoes', 'corn', 'tuna', 'soup', 'coconut_milk'],
        spices: ['paprika', 'cumin', 'cinnamon', 'turmeric', 'oregano', 'basil'],
        oils: ['olive', 'vegetable', 'coconut', 'sesame', 'avocado', 'peanut'],
        baking: ['flour', 'sugar', 'baking_powder', 'baking_soda', 'yeast', 'vanilla']
      },
      dairy: {
        milk: ['whole', 'skim', 'almond', 'soy', 'oat', 'coconut'],
        cheese: ['cheddar', 'mozzarella', 'parmesan', 'feta', 'gouda', 'blue'],
        yogurt: ['greek', 'regular', 'coconut', 'almond', 'kefir', 'skyr'],
        butter: ['salted', 'unsalted', 'clarified', 'plant-based', 'whipped', 'cultured'],
        cream: ['heavy', 'light', 'sour', 'whipped', 'half-and-half', 'creme_fraiche'],
        alternatives: ['almond', 'soy', 'oat', 'coconut', 'cashew', 'rice']
      },
      fruit: {
        berries: ['strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry', 'acai'],
        citrus: ['orange', 'lemon', 'lime', 'grapefruit', 'tangerine', 'kumquat'],
        tropical: ['banana', 'pineapple', 'mango', 'papaya', 'kiwi', 'passion_fruit'],
        pome: ['apple', 'pear', 'quince', 'crabapple', 'medlar', 'loquat'],
        stone: ['peach', 'plum', 'cherry', 'apricot', 'nectarine', 'mango'],
        melons: ['watermelon', 'cantaloupe', 'honeydew', 'casaba', 'crenshaw', 'galia']
      },
      cookware: {
        pots: ['stock', 'sauce', 'dutch', 'pressure', 'slow', 'multi'],
        pans: ['frying', 'saute', 'grill', 'griddle', 'wok', 'crepe'],
        bakeware: ['sheet', 'cake', 'muffin', 'loaf', 'casserole', 'pie'],
        utensils: ['spatula', 'whisk', 'tongs', 'ladle', 'spoon', 'turner'],
        appliances: ['blender', 'mixer', 'processor', 'toaster', 'microwave', 'airfryer'],
        knives: ['chef', 'paring', 'bread', 'utility', 'santoku', 'cleaver']
      }
    };
    
    // Function to analyze recipe ingredients and determine detailed tags
    function analyzeRecipeIngredients(recipe) {
      const detailedTags = {
        protein_category: [],
        protein_type: [],
        protein_cut: [],
        veggie_category: [],
        veggie_type: [],
        veggie_variety: [],
        pantry_category: [],
        pantry_type: [],
        pantry_variety: [],
        dairy_category: [],
        dairy_type: [],
        dairy_variety: [],
        fruit_category: [],
        fruit_type: [],
        fruit_variety: [],
        cookware_category: [],
        cookware_type: [],
        cookware_variety: []
      };
      
      // Helper function to check if an ingredient contains a specific term
      function ingredientContains(ingredient, term) {
        if (typeof ingredient === 'string') {
          return ingredient.toLowerCase().includes(term.toLowerCase());
        }
        return false;
      }
      
      // Process protein tags
      if (Array.isArray(recipe.protein_tags)) {
        recipe.protein_tags.forEach(tag => {
          detailedTags.protein_category.push('protein');
          
          // Determine protein type
          for (const [type, cuts] of Object.entries(tagStructure.protein)) {
            if (ingredientContains(tag, type)) {
              detailedTags.protein_type.push(type);
              
              // Determine protein cut
              for (const cut of cuts) {
                if (ingredientContains(tag, cut)) {
                  detailedTags.protein_cut.push(cut);
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Process veggie tags
      if (Array.isArray(recipe.veggie_tags)) {
        recipe.veggie_tags.forEach(tag => {
          detailedTags.veggie_category.push('veggies');
          
          // Determine veggie type
          for (const [type, varieties] of Object.entries(tagStructure.veggies)) {
            if (ingredientContains(tag, type)) {
              detailedTags.veggie_type.push(type);
              
              // Determine veggie variety
              for (const variety of varieties) {
                if (ingredientContains(tag, variety)) {
                  detailedTags.veggie_variety.push(variety);
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Process ingredients array for additional tags
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          if (typeof ingredient !== 'string') return;
          
          const ingredientLower = ingredient.toLowerCase();
          
          // Check all categories
          for (const [category, types] of Object.entries(tagStructure)) {
            for (const [type, varieties] of Object.entries(types)) {
              for (const variety of varieties) {
                if (ingredientLower.includes(variety)) {
                  // Add tags based on the category
                  if (category === 'protein') {
                    if (!detailedTags.protein_category.includes('protein')) detailedTags.protein_category.push('protein');
                    if (!detailedTags.protein_type.includes(type)) detailedTags.protein_type.push(type);
                    if (!detailedTags.protein_cut.includes(variety)) detailedTags.protein_cut.push(variety);
                  } else if (category === 'veggies') {
                    if (!detailedTags.veggie_category.includes('veggies')) detailedTags.veggie_category.push('veggies');
                    if (!detailedTags.veggie_type.includes(type)) detailedTags.veggie_type.push(type);
                    if (!detailedTags.veggie_variety.includes(variety)) detailedTags.veggie_variety.push(variety);
                  } else if (category === 'pantry') {
                    if (!detailedTags.pantry_category.includes('pantry')) detailedTags.pantry_category.push('pantry');
                    if (!detailedTags.pantry_type.includes(type)) detailedTags.pantry_type.push(type);
                    if (!detailedTags.pantry_variety.includes(variety)) detailedTags.pantry_variety.push(variety);
                  } else if (category === 'dairy') {
                    if (!detailedTags.dairy_category.includes('dairy')) detailedTags.dairy_category.push('dairy');
                    if (!detailedTags.dairy_type.includes(type)) detailedTags.dairy_type.push(type);
                    if (!detailedTags.dairy_variety.includes(variety)) detailedTags.dairy_variety.push(variety);
                  } else if (category === 'fruit') {
                    if (!detailedTags.fruit_category.includes('fruit')) detailedTags.fruit_category.push('fruit');
                    if (!detailedTags.fruit_type.includes(type)) detailedTags.fruit_type.push(type);
                    if (!detailedTags.fruit_variety.includes(variety)) detailedTags.fruit_variety.push(variety);
                  } else if (category === 'cookware') {
                    if (!detailedTags.cookware_category.includes('cookware')) detailedTags.cookware_category.push('cookware');
                    if (!detailedTags.cookware_type.includes(type)) detailedTags.cookware_type.push(type);
                    if (!detailedTags.cookware_variety.includes(variety)) detailedTags.cookware_variety.push(variety);
                  }
                  break;
                }
              }
            }
          }
        });
      }
      
      // Process required cookware
      if (Array.isArray(recipe.required_cookware)) {
        recipe.required_cookware.forEach(cookware => {
          if (typeof cookware !== 'string') return;
          
          const cookwareLower = cookware.toLowerCase();
          detailedTags.cookware_category.push('cookware');
          
          // Determine cookware type
          for (const [type, varieties] of Object.entries(tagStructure.cookware)) {
            if (cookwareLower.includes(type) || 
                (type === 'pots' && (cookwareLower.includes('pot') || cookwareLower.includes('dutch') || cookwareLower.includes('cooker'))) ||
                (type === 'pans' && (cookwareLower.includes('pan') || cookwareLower.includes('skillet'))) ||
                (type === 'bakeware' && (cookwareLower.includes('dish') || cookwareLower.includes('sheet') || cookwareLower.includes('tin'))) ||
                (type === 'utensils' && (cookwareLower.includes('spoon') || cookwareLower.includes('spatula') || cookwareLower.includes('tongs'))) ||
                (type === 'appliances' && (cookwareLower.includes('blender') || cookwareLower.includes('processor') || cookwareLower.includes('mixer'))) ||
                (type === 'knives' && (cookwareLower.includes('knife') || cookwareLower.includes('cutter')))) {
              
              detailedTags.cookware_type.push(type);
              
              // Determine cookware variety
              for (const variety of varieties) {
                if (cookwareLower.includes(variety)) {
                  detailedTags.cookware_variety.push(variety);
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Remove duplicates and return
      for (const key in detailedTags) {
        detailedTags[key] = [...new Set(detailedTags[key])];
      }
      
      return detailedTags;
    }
    
    // Update each recipe with detailed tags
    const updatedRecipes = [];
    for (const recipe of recipes) {
      const detailedTags = analyzeRecipeIngredients(recipe);
      
      const updatedRecipe = {
        id: recipe.id,
        ...detailedTags
      };
      
      updatedRecipes.push(updatedRecipe);
      
      console.log(`Processed recipe: ${recipe.name || recipe.id}`);
    }
    
    // Update recipes in batches to avoid rate limiting
    const batchSize = 20;
    for (let i = 0; i < updatedRecipes.length; i += batchSize) {
      const batch = updatedRecipes.slice(i, i + batchSize);
      
      const { error: updateError } = await supabase
        .from('recipes')
        .upsert(batch, { onConflict: 'id' });
      
      if (updateError) {
        console.error(`Error updating batch ${i / batchSize + 1}:`, updateError);
      } else {
        console.log(`Updated batch ${i / batchSize + 1} of ${Math.ceil(updatedRecipes.length / batchSize)}`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log('Recipe tag update completed successfully!');
  } catch (error) {
    console.error('Error in updateRecipeTags:', error);
  }
}

// Run the function
updateRecipeTags();
