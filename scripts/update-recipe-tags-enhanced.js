import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Script to update recipe tags in Supabase with the enhanced three-level tagging system
 * for both ingredients and cookware
 */
async function updateRecipeTags() {
  try {
    console.log('Starting recipe tag update with enhanced three-level tagging...');
    
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
    
    // Define the updated three-level tagging structure based on the Kitchen component
    const tagStructure = {
      protein: {
        beef: ['ground', 'steak', 'roast', 'ribs', 'brisket', 'other'],
        chicken: ['breast', 'thigh', 'drumstick', 'wing', 'whole', 'ground'],
        pork: ['chop', 'ground', 'loin', 'shoulder', 'belly', 'ribs'],
        fish: ['fillet', 'steak', 'whole', 'smoked', 'canned', 'ground'],
        tofu: ['extra_firm', 'firm', 'soft', 'silken', 'smoked', 'fried'],
        eggs: ['chicken', 'duck', 'quail', 'free_range', 'organic', 'egg_whites']
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
        grains: ['white_rice', 'brown_rice', 'wild_rice', 'jasmine', 'basmati', 'arborio'],
        pasta: ['dried', 'fresh', 'whole_wheat', 'gluten_free', 'egg', 'stuffed'],
        canned: ['black', 'kidney', 'chickpeas', 'diced', 'crushed', 'paste'],
        spices: ['whole', 'ground', 'dried_herbs', 'blends', 'seeds', 'peppercorns'],
        oils: ['extra_virgin', 'virgin', 'pure', 'refined', 'infused', 'spray'],
        baking: ['all_purpose', 'bread', 'cake', 'whole_wheat', 'gluten_free', 'self_rising']
      },
      dairy: {
        milk: ['whole', 'reduced', 'skim', 'almond', 'soy', 'oat'],
        cheese: ['cheddar', 'mozzarella', 'parmesan', 'swiss', 'blue', 'cream'],
        yogurt: ['greek', 'regular', 'lowfat', 'nonfat', 'flavored', 'plant'],
        butter: ['salted', 'unsalted', 'clarified', 'whipped', 'plant', 'compound'],
        cream: ['heavy', 'light', 'half', 'whipping', 'sour', 'clotted'],
        alternatives: ['almond', 'soy', 'oat', 'coconut', 'cashew', 'rice']
      },
      fruit: {
        berries: ['strawberry', 'blueberry', 'raspberry', 'blackberry', 'cranberry', 'mixed'],
        citrus: ['orange', 'lemon', 'lime', 'grapefruit', 'tangerine', 'kumquat'],
        tropical: ['pineapple', 'mango', 'banana', 'kiwi', 'papaya', 'passion'],
        pome: ['apple', 'pear', 'quince', 'crabapple', 'medlar', 'loquat'],
        stone: ['peach', 'plum', 'cherry', 'apricot', 'nectarine', 'mango'],
        melons: ['watermelon', 'cantaloupe', 'honeydew', 'casaba', 'galia', 'canary']
      }
    };
    
    // Define the cookware tagging structure
    const cookwareTagStructure = {
      pots: {
        stock: ['stainless', 'aluminum', 'nonstick', 'ceramic', 'enamel', 'copper'],
        sauce: ['small', 'medium', 'large', 'stainless', 'nonstick', 'copper'],
        dutch: ['cast_iron', 'enamel', 'small', 'medium', 'large', 'oval'],
        pressure: ['electric', 'stovetop', 'small', 'medium', 'large', 'multi'],
        slow: ['small', 'medium', 'large', 'programmable', 'manual', 'travel'],
        multi: ['instant', 'ninja', 'small', 'medium', 'large', 'deluxe']
      },
      pans: {
        frying: ['cast_iron', 'nonstick', 'stainless', 'small', 'medium', 'large'],
        saute: ['stainless', 'nonstick', 'small', 'medium', 'large', 'copper'],
        grill: ['cast_iron', 'nonstick', 'ridged', 'flat', 'reversible', 'electric'],
        griddle: ['cast_iron', 'nonstick', 'electric', 'stovetop', 'double', 'reversible'],
        wok: ['carbon', 'cast_iron', 'nonstick', 'flat', 'round', 'electric'],
        crepe: ['nonstick', 'cast_iron', 'electric', 'carbon', 'small', 'large']
      },
      bakeware: {
        sheet: ['aluminum', 'nonstick', 'insulated', 'small', 'medium', 'large'],
        cake: ['round', 'square', 'springform', 'bundt', 'sheet', 'layer'],
        muffin: ['standard', 'mini', 'jumbo', 'silicone', 'nonstick', 'metal'],
        loaf: ['standard', 'mini', 'pullman', 'silicone', 'nonstick', 'glass'],
        casserole: ['glass', 'ceramic', 'metal', 'small', 'medium', 'large'],
        pie: ['glass', 'ceramic', 'metal', 'deep', 'standard', 'mini']
      },
      utensils: {
        spatula: ['silicone', 'metal', 'wood', 'plastic', 'fish', 'offset'],
        whisk: ['balloon', 'french', 'flat', 'silicone', 'metal', 'mini'],
        tongs: ['metal', 'silicone', 'locking', 'long', 'short', 'bbq'],
        ladle: ['metal', 'silicone', 'plastic', 'small', 'large', 'soup'],
        spoon: ['wood', 'metal', 'silicone', 'slotted', 'solid', 'serving'],
        turner: ['metal', 'silicone', 'plastic', 'slotted', 'solid', 'fish']
      },
      appliances: {
        blender: ['countertop', 'immersion', 'personal', 'high_speed', 'standard', 'professional'],
        mixer: ['stand', 'hand', 'kitchenaid', 'planetary', 'compact', 'professional'],
        processor: ['full_size', 'mini', 'chopper', 'manual', 'electric', 'professional'],
        toaster: ['two_slice', 'four_slice', 'toaster_oven', 'convection', 'smart', 'retro'],
        microwave: ['countertop', 'built_in', 'convection', 'small', 'medium', 'large'],
        airfryer: ['basket', 'oven', 'combo', 'small', 'medium', 'large']
      },
      knives: {
        chef: ['german', 'japanese', 'small', 'medium', 'large', 'carbon'],
        paring: ['straight', 'bird_beak', 'sheep_foot', 'small', 'medium', 'ceramic'],
        bread: ['serrated', 'offset', 'straight', 'short', 'medium', 'long'],
        utility: ['straight', 'serrated', 'small', 'medium', 'japanese', 'german'],
        santoku: ['traditional', 'hollow', 'small', 'medium', 'large', 'damascus'],
        cleaver: ['chinese', 'butcher', 'vegetable', 'small', 'medium', 'large']
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
          
          // Check pantry categories
          for (const [type, varieties] of Object.entries(tagStructure.pantry)) {
            for (const variety of varieties) {
              if (ingredientLower.includes(variety)) {
                if (!detailedTags.pantry_category.includes('pantry')) detailedTags.pantry_category.push('pantry');
                if (!detailedTags.pantry_type.includes(type)) detailedTags.pantry_type.push(type);
                if (!detailedTags.pantry_variety.includes(variety)) detailedTags.pantry_variety.push(variety);
                break;
              }
            }
          }
          
          // Check dairy categories
          for (const [type, varieties] of Object.entries(tagStructure.dairy)) {
            for (const variety of varieties) {
              if (ingredientLower.includes(variety)) {
                if (!detailedTags.dairy_category.includes('dairy')) detailedTags.dairy_category.push('dairy');
                if (!detailedTags.dairy_type.includes(type)) detailedTags.dairy_type.push(type);
                if (!detailedTags.dairy_variety.includes(variety)) detailedTags.dairy_variety.push(variety);
                break;
              }
            }
          }
          
          // Check fruit categories
          for (const [type, varieties] of Object.entries(tagStructure.fruit)) {
            for (const variety of varieties) {
              if (ingredientLower.includes(variety)) {
                if (!detailedTags.fruit_category.includes('fruit')) detailedTags.fruit_category.push('fruit');
                if (!detailedTags.fruit_type.includes(type)) detailedTags.fruit_type.push(type);
                if (!detailedTags.fruit_variety.includes(variety)) detailedTags.fruit_variety.push(variety);
                break;
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
          
          // Determine cookware category and type
          for (const [category, types] of Object.entries(cookwareTagStructure)) {
            let categoryMatch = false;
            
            // Check if cookware matches category keywords
            if (cookwareLower.includes(category) || 
                (category === 'pots' && (cookwareLower.includes('pot') || cookwareLower.includes('dutch') || cookwareLower.includes('cooker'))) ||
                (category === 'pans' && (cookwareLower.includes('pan') || cookwareLower.includes('skillet'))) ||
                (category === 'bakeware' && (cookwareLower.includes('dish') || cookwareLower.includes('sheet') || cookwareLower.includes('tin'))) ||
                (category === 'utensils' && (cookwareLower.includes('spoon') || cookwareLower.includes('spatula') || cookwareLower.includes('tongs'))) ||
                (category === 'appliances' && (cookwareLower.includes('blender') || cookwareLower.includes('processor') || cookwareLower.includes('mixer'))) ||
                (category === 'knives' && (cookwareLower.includes('knife') || cookwareLower.includes('cutter')))) {
              
              if (!detailedTags.cookware_type.includes(category)) {
                detailedTags.cookware_type.push(category);
              }
              categoryMatch = true;
              
              // Determine specific type and variety
              for (const [type, varieties] of Object.entries(types)) {
                if (cookwareLower.includes(type)) {
                  if (!detailedTags.cookware_variety.includes(type)) {
                    detailedTags.cookware_variety.push(type);
                  }
                  
                  // Check for specific variety
                  for (const variety of varieties) {
                    if (cookwareLower.includes(variety)) {
                      if (!detailedTags.cookware_variety.includes(variety)) {
                        detailedTags.cookware_variety.push(variety);
                      }
                      break;
                    }
                  }
                  break;
                }
              }
            }
            
            if (categoryMatch) break;
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
      // Skip recipes with null names to avoid errors
      if (!recipe.name) {
        console.log(`Skipping recipe with ID ${recipe.id} due to null name`);
        continue;
      }
      
      const detailedTags = analyzeRecipeIngredients(recipe);
      
      const updatedRecipe = {
        id: recipe.id,
        ...detailedTags
      };
      
      updatedRecipes.push(updatedRecipe);
      
      console.log(`Processed recipe: ${recipe.name || recipe.id}`);
    }
    
    // Update recipes one by one instead of in batches to avoid issues with null names
    console.log('Updating recipes one by one to avoid batch update issues...');
    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;
    
    for (const recipe of updatedRecipes) {
      try {
        const { error: updateError } = await supabase
          .from('recipes')
          .update(recipe)
          .eq('id', recipe.id);
        
        if (updateError) {
          console.error(`Error updating recipe ${recipe.id}:`, updateError.message);
          errorCount++;
        } else {
          successCount++;
        }
      } catch (error) {
        console.error(`Exception updating recipe ${recipe.id}:`, error.message);
        errorCount++;
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    console.log(`Recipe tag update completed with: ${successCount} successful, ${skipCount} skipped, ${errorCount} errors`);
  } catch (error) {
    console.error('Error in updateRecipeTags:', error);
  }
}

// Run the function
updateRecipeTags();
