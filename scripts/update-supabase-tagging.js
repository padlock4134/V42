import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_ANON_KEY must be set in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Define the three-level tagging structure
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
    pots: ['stock_pot', 'sauce_pan', 'dutch_oven', 'pressure_cooker', 'slow_cooker', 'multi_cooker'],
    pans: ['frying_pan', 'saute_pan', 'grill_pan', 'sheet_pan', 'roasting_pan', 'wok'],
    bakeware: ['baking_dish', 'cake_pan', 'muffin_tin', 'loaf_pan', 'pie_dish', 'casserole'],
    tools: ['knife', 'cutting_board', 'spatula', 'whisk', 'tongs', 'measuring_cups'],
    appliances: ['blender', 'food_processor', 'mixer', 'toaster', 'air_fryer', 'microwave'],
    specialty: ['mortar_pestle', 'mandoline', 'zester', 'thermometer', 'scale', 'strainer']
  }
};

// Define the columns to add
const columnsToAdd = [
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
  { name: 'fruit_variety', type: 'text[]' },
  
  // Cookware category columns
  { name: 'cookware_category', type: 'text[]' },
  { name: 'cookware_type', type: 'text[]' },
  { name: 'cookware_variety', type: 'text[]' },
  
  // Custom ingredients column
  { name: 'custom_ingredients', type: 'jsonb' }
];

// Function to check if a column exists
async function columnExists(tableName, columnName) {
  const { data, error } = await supabase.rpc('check_column_exists', {
    p_table_name: tableName,
    p_column_name: columnName
  });
  
  if (error) {
    console.error(`Error checking if column ${columnName} exists:`, error);
    return false;
  }
  
  return data;
}

// Function to add a column if it doesn't exist
async function addColumnIfNotExists(tableName, columnName, columnType) {
  try {
    // Check if the column exists
    const exists = await columnExists(tableName, columnName);
    
    if (!exists) {
      console.log(`Column ${columnName} does not exist. Adding it...`);
      
      // Add the column
      const { error } = await supabase.rpc('add_column', {
        p_table_name: tableName,
        p_column_name: columnName,
        p_column_type: columnType
      });
      
      if (error) {
        console.error(`Error adding column ${columnName}:`, error);
        return false;
      }
      
      console.log(`Column ${columnName} added successfully.`);
      return true;
    } else {
      console.log(`Column ${columnName} already exists.`);
      return true;
    }
  } catch (error) {
    console.error(`Error in addColumnIfNotExists for ${columnName}:`, error);
    return false;
  }
}

// Function to generate detailed tags for a recipe
function generateDetailedTags(recipe) {
  // Initialize the detailed tags object
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
    cookware_variety: [],
    custom_ingredients: []
  };
  
  // Helper function to check if an ingredient contains a specific term
  function ingredientContains(ingredient, term) {
    return ingredient.toLowerCase().includes(term.toLowerCase());
  }
  
  // Process ingredients for detailed tags
  if (Array.isArray(recipe.ingredients)) {
    recipe.ingredients.forEach(ingredient => {
      if (typeof ingredient !== 'string') return;
      
      let matched = false;
      
      // Check each category
      for (const [category, types] of Object.entries(tagStructure)) {
        for (const [type, varieties] of Object.entries(types)) {
          for (const variety of varieties) {
            if (ingredientContains(ingredient, variety)) {
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
              }
              matched = true;
              break;
            }
          }
          if (matched) break;
        }
        if (matched) break;
      }
      
      // If not matched to any category, add to custom ingredients
      if (!matched) {
        detailedTags.custom_ingredients.push({
          name: ingredient,
          category: 'custom',
          type: 'other',
          cut: 'other'
        });
      }
    });
  }
  
  // Process protein tags
  if (Array.isArray(recipe.protein_tags)) {
    recipe.protein_tags.forEach(tag => {
      if (!detailedTags.protein_category.includes('protein')) {
        detailedTags.protein_category.push('protein');
      }
      
      // Determine protein type
      for (const [type, cuts] of Object.entries(tagStructure.protein)) {
        if (ingredientContains(tag, type)) {
          if (!detailedTags.protein_type.includes(type)) {
            detailedTags.protein_type.push(type);
          }
          
          // Determine protein cut
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
  
  // Process veggie tags
  if (Array.isArray(recipe.veggie_tags)) {
    recipe.veggie_tags.forEach(tag => {
      if (!detailedTags.veggie_category.includes('veggies')) {
        detailedTags.veggie_category.push('veggies');
      }
      
      // Determine veggie type
      for (const [type, varieties] of Object.entries(tagStructure.veggies)) {
        if (ingredientContains(tag, type)) {
          if (!detailedTags.veggie_type.includes(type)) {
            detailedTags.veggie_type.push(type);
          }
          
          // Determine veggie variety
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
  
  // Process required_cookware for cookware tags
  if (Array.isArray(recipe.required_cookware)) {
    recipe.required_cookware.forEach(cookware => {
      if (!detailedTags.cookware_category.includes('cookware')) {
        detailedTags.cookware_category.push('cookware');
      }
      
      let matched = false;
      
      // Determine cookware type
      for (const [type, varieties] of Object.entries(tagStructure.cookware)) {
        if (ingredientContains(cookware, type)) {
          if (!detailedTags.cookware_type.includes(type)) {
            detailedTags.cookware_type.push(type);
          }
          
          // Determine cookware variety
          for (const variety of varieties) {
            if (ingredientContains(cookware, variety)) {
              if (!detailedTags.cookware_variety.includes(variety)) {
                detailedTags.cookware_variety.push(variety);
              }
              matched = true;
              break;
            }
          }
          
          if (!matched) {
            // If no specific variety matched, use a default or the cookware name itself
            const defaultVariety = cookware.toLowerCase().replace(/\s+/g, '_');
            if (!detailedTags.cookware_variety.includes(defaultVariety)) {
              detailedTags.cookware_variety.push(defaultVariety);
            }
          }
          
          matched = true;
          break;
        }
      }
      
      // If no type matched, use a default type
      if (!matched) {
        if (!detailedTags.cookware_type.includes('other')) {
          detailedTags.cookware_type.push('other');
        }
        
        const defaultVariety = cookware.toLowerCase().replace(/\s+/g, '_');
        if (!detailedTags.cookware_variety.includes(defaultVariety)) {
          detailedTags.cookware_variety.push(defaultVariety);
        }
      }
    });
  }
  
  return detailedTags;
}

// Function to update recipes with detailed tags
async function updateRecipesWithDetailedTags() {
  try {
    console.log('Fetching recipes from Supabase...');
    
    // Get all recipes
    const { data: recipes, error } = await supabase
      .from('recipes')
      .select('*');
    
    if (error) {
      console.error('Error fetching recipes:', error);
      return;
    }
    
    console.log(`Found ${recipes.length} recipes to update`);
    
    // Process recipes in batches to avoid request size limits
    const batchSize = 10;
    const batches = [];
    
    for (let i = 0; i < recipes.length; i += batchSize) {
      batches.push(recipes.slice(i, i + batchSize));
    }
    
    // Update each batch
    for (let i = 0; i < batches.length; i++) {
      const batch = batches[i];
      const updatedBatch = batch.map(recipe => {
        console.log(`Processing recipe: ${recipe.name}`);
        
        // Generate detailed tags
        const detailedTags = generateDetailedTags(recipe);
        
        // Return updated recipe
        return {
          id: recipe.id,
          ...detailedTags
        };
      });
      
      // Update the batch in Supabase
      const { error: updateError } = await supabase
        .from('recipes')
        .upsert(updatedBatch);
      
      if (updateError) {
        console.error(`Error updating batch ${i + 1}:`, updateError);
      } else {
        console.log(`Batch ${i + 1} updated successfully`);
      }
    }
    
    console.log('Recipe tag update completed!');
  } catch (error) {
    console.error('Error in updateRecipesWithDetailedTags:', error);
  }
}

// Main function to run the script
async function main() {
  try {
    console.log('Starting Supabase tagging update...');
    
    // Test connection to Supabase
    const { data, error } = await supabase.from('recipes').select('count()', { count: 'exact' });
    
    if (error) {
      console.error('Error connecting to Supabase:', error);
      return;
    }
    
    console.log('Connected to Supabase successfully');
    
    // Create the necessary functions in Supabase
    console.log('Creating helper functions in Supabase...');
    
    // Function to check if a column exists
    const checkColumnExistsQuery = `
      CREATE OR REPLACE FUNCTION check_column_exists(p_table_name text, p_column_name text)
      RETURNS boolean AS $$
      DECLARE
        column_exists boolean;
      BEGIN
        SELECT EXISTS (
          SELECT 1
          FROM information_schema.columns
          WHERE table_name = p_table_name
          AND column_name = p_column_name
        ) INTO column_exists;
        
        RETURN column_exists;
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Function to add a column
    const addColumnQuery = `
      CREATE OR REPLACE FUNCTION add_column(p_table_name text, p_column_name text, p_column_type text)
      RETURNS void AS $$
      BEGIN
        EXECUTE format('ALTER TABLE %I ADD COLUMN IF NOT EXISTS %I %s', p_table_name, p_column_name, p_column_type);
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
    `;
    
    // Create the functions
    try {
      const { error: checkColumnError } = await supabase.rpc('exec_sql', { sql: checkColumnExistsQuery });
      if (checkColumnError) {
        console.error('Error creating check_column_exists function:', checkColumnError);
        console.log('Attempting to create functions using SQL Editor...');
        console.log('Please run the following SQL in the Supabase SQL Editor:');
        console.log(checkColumnExistsQuery);
        console.log(addColumnQuery);
      } else {
        const { error: addColumnError } = await supabase.rpc('exec_sql', { sql: addColumnQuery });
        if (addColumnError) {
          console.error('Error creating add_column function:', addColumnError);
          console.log('Please run the following SQL in the Supabase SQL Editor:');
          console.log(addColumnQuery);
        } else {
          console.log('Helper functions created successfully');
        }
      }
    } catch (error) {
      console.error('Error creating helper functions:', error);
      console.log('Please run the following SQL in the Supabase SQL Editor:');
      console.log(checkColumnExistsQuery);
      console.log(addColumnQuery);
      
      // Generate SQL to add all columns
      const addColumnsSQL = columnsToAdd.map(column => 
        `ALTER TABLE recipes ADD COLUMN IF NOT EXISTS ${column.name} ${column.type};`
      ).join('\n');
      
      console.log('Alternatively, run this SQL to add all columns at once:');
      console.log(addColumnsSQL);
      
      return;
    }
    
    // Add columns to the recipes table
    console.log('Adding columns to the recipes table...');
    
    for (const column of columnsToAdd) {
      await addColumnIfNotExists('recipes', column.name, column.type);
    }
    
    // Update recipes with detailed tags
    console.log('Updating recipes with detailed tags...');
    await updateRecipesWithDetailedTags();
    
    console.log('Supabase tagging update completed successfully!');
  } catch (error) {
    console.error('Error in main function:', error);
  }
}

// Run the script
main();
