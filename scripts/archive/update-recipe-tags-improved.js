import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Improved script to update recipe tags in Supabase with the enhanced three-level tagging system
 */
async function updateRecipeTags() {
  try {
    console.log('Starting improved recipe tag update...');
    
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
    
    // Get all recipes with their ingredients and cookware
    const { data: recipes, error: recipesError } = await supabase
      .from('recipes')
      .select('*');
    
    if (recipesError) {
      console.error('Error fetching recipes:', recipesError);
      return;
    }
    
    console.log(`Found ${recipes.length} recipes to update`);
    
    // Define the ingredient tagging structure
    const ingredientTagStructure = {
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
      }
    };
    
    // Define the cookware tagging structure
    const cookwareTagStructure = {
      pots: ['stock', 'sauce', 'dutch', 'pressure', 'slow', 'multi'],
      pans: ['frying', 'saute', 'grill', 'griddle', 'wok', 'crepe'],
      bakeware: ['sheet', 'cake', 'muffin', 'loaf', 'casserole', 'pie'],
      utensils: ['spatula', 'whisk', 'tongs', 'ladle', 'spoon', 'turner'],
      appliances: ['blender', 'mixer', 'processor', 'toaster', 'microwave', 'airfryer'],
      knives: ['chef', 'paring', 'bread', 'utility', 'santoku', 'cleaver']
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
      
      // Process ingredients array
      if (Array.isArray(recipe.ingredients)) {
        recipe.ingredients.forEach(ingredient => {
          if (typeof ingredient !== 'string') return;
          
          const ingredientLower = ingredient.toLowerCase();
          
          // Check for protein ingredients
          for (const [type, cuts] of Object.entries(ingredientTagStructure.protein)) {
            if (ingredientLower.includes(type)) {
              if (!detailedTags.protein_category.includes('protein')) {
                detailedTags.protein_category.push('protein');
              }
              if (!detailedTags.protein_type.includes(type)) {
                detailedTags.protein_type.push(type);
              }
              
              // Check for specific cuts
              for (const cut of cuts) {
                if (ingredientLower.includes(cut)) {
                  if (!detailedTags.protein_cut.includes(cut)) {
                    detailedTags.protein_cut.push(cut);
                  }
                  break;
                }
              }
            }
          }
          
          // Check for veggie ingredients
          for (const [type, varieties] of Object.entries(ingredientTagStructure.veggies)) {
            if (ingredientLower.includes(type)) {
              if (!detailedTags.veggie_category.includes('veggies')) {
                detailedTags.veggie_category.push('veggies');
              }
              if (!detailedTags.veggie_type.includes(type)) {
                detailedTags.veggie_type.push(type);
              }
              
              // Check for specific varieties
              for (const variety of varieties) {
                if (ingredientLower.includes(variety)) {
                  if (!detailedTags.veggie_variety.includes(variety)) {
                    detailedTags.veggie_variety.push(variety);
                  }
                  break;
                }
              }
            }
          }
          
          // Check for pantry ingredients
          for (const [type, varieties] of Object.entries(ingredientTagStructure.pantry)) {
            if (ingredientLower.includes(type)) {
              if (!detailedTags.pantry_category.includes('pantry')) {
                detailedTags.pantry_category.push('pantry');
              }
              if (!detailedTags.pantry_type.includes(type)) {
                detailedTags.pantry_type.push(type);
              }
              
              // Check for specific varieties
              for (const variety of varieties) {
                if (ingredientLower.includes(variety)) {
                  if (!detailedTags.pantry_variety.includes(variety)) {
                    detailedTags.pantry_variety.push(variety);
                  }
                  break;
                }
              }
            }
          }
          
          // Check for dairy ingredients
          for (const [type, varieties] of Object.entries(ingredientTagStructure.dairy)) {
            if (ingredientLower.includes(type)) {
              if (!detailedTags.dairy_category.includes('dairy')) {
                detailedTags.dairy_category.push('dairy');
              }
              if (!detailedTags.dairy_type.includes(type)) {
                detailedTags.dairy_type.push(type);
              }
              
              // Check for specific varieties
              for (const variety of varieties) {
                if (ingredientLower.includes(variety)) {
                  if (!detailedTags.dairy_variety.includes(variety)) {
                    detailedTags.dairy_variety.push(variety);
                  }
                  break;
                }
              }
            }
          }
          
          // Check for fruit ingredients
          for (const [type, varieties] of Object.entries(ingredientTagStructure.fruit)) {
            if (ingredientLower.includes(type)) {
              if (!detailedTags.fruit_category.includes('fruit')) {
                detailedTags.fruit_category.push('fruit');
              }
              if (!detailedTags.fruit_type.includes(type)) {
                detailedTags.fruit_type.push(type);
              }
              
              // Check for specific varieties
              for (const variety of varieties) {
                if (ingredientLower.includes(variety)) {
                  if (!detailedTags.fruit_variety.includes(variety)) {
                    detailedTags.fruit_variety.push(variety);
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
          
          if (!detailedTags.cookware_category.includes('cookware')) {
            detailedTags.cookware_category.push('cookware');
          }
          
          // Determine cookware type
          for (const [type, varieties] of Object.entries(cookwareTagStructure)) {
            if (cookwareLower.includes(type) || 
                (type === 'pots' && (cookwareLower.includes('pot') || cookwareLower.includes('dutch'))) ||
                (type === 'pans' && (cookwareLower.includes('pan') || cookwareLower.includes('skillet'))) ||
                (type === 'bakeware' && (cookwareLower.includes('dish') || cookwareLower.includes('sheet'))) ||
                (type === 'utensils' && (cookwareLower.includes('spoon') || cookwareLower.includes('spatula'))) ||
                (type === 'appliances' && (cookwareLower.includes('blender') || cookwareLower.includes('processor'))) ||
                (type === 'knives' && cookwareLower.includes('knife'))) {
              
              if (!detailedTags.cookware_type.includes(type)) {
                detailedTags.cookware_type.push(type);
              }
              
              // Determine cookware variety
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
        });
      }
      
      // Process existing tags to ensure we don't miss anything
      // Protein tags
      if (Array.isArray(recipe.protein_tags)) {
        recipe.protein_tags.forEach(tag => {
          if (!detailedTags.protein_category.includes('protein')) {
            detailedTags.protein_category.push('protein');
          }
          
          // Try to determine protein type from tag
          for (const [type, cuts] of Object.entries(ingredientTagStructure.protein)) {
            if (ingredientContains(tag, type)) {
              if (!detailedTags.protein_type.includes(type)) {
                detailedTags.protein_type.push(type);
              }
              
              // Try to determine protein cut from tag
              for (const cut of cuts) {
                if (ingredientContains(tag, cut)) {
                  if (!detailedTags.protein_cut.includes(cut)) {
                    detailedTags.protein_cut.push(cut);
                  }
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Veggie tags
      if (Array.isArray(recipe.veggie_tags)) {
        recipe.veggie_tags.forEach(tag => {
          if (!detailedTags.veggie_category.includes('veggies')) {
            detailedTags.veggie_category.push('veggies');
          }
          
          // Try to determine veggie type from tag
          for (const [type, varieties] of Object.entries(ingredientTagStructure.veggies)) {
            if (ingredientContains(tag, type)) {
              if (!detailedTags.veggie_type.includes(type)) {
                detailedTags.veggie_type.push(type);
              }
              
              // Try to determine veggie variety from tag
              for (const variety of varieties) {
                if (ingredientContains(tag, variety)) {
                  if (!detailedTags.veggie_variety.includes(variety)) {
                    detailedTags.veggie_variety.push(variety);
                  }
                  break;
                }
              }
              break;
            }
          }
        });
      }
      
      // Remove duplicates
      for (const key in detailedTags) {
        detailedTags[key] = [...new Set(detailedTags[key])];
      }
      
      return detailedTags;
    }
    
    // Update each recipe with detailed tags
    const updatedRecipes = [];
    for (const recipe of recipes) {
      try {
        const detailedTags = analyzeRecipeIngredients(recipe);
        
        const updatedRecipe = {
          id: recipe.id,
          ...detailedTags
        };
        
        updatedRecipes.push(updatedRecipe);
        
        console.log(`Processed recipe: ${recipe.name || recipe.id}`);
      } catch (error) {
        console.error(`Error processing recipe ${recipe.id}:`, error);
      }
    }
    
    // Update recipes in batches to avoid rate limiting
    const batchSize = 10;
    for (let i = 0; i < updatedRecipes.length; i += batchSize) {
      try {
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
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Error with batch ${i / batchSize + 1}:`, error);
      }
    }
    
    console.log('Recipe tag update completed successfully!');
  } catch (error) {
    console.error('Error in updateRecipeTags:', error);
  }
}

// Run the function
updateRecipeTags();
