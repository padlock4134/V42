import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import recipeService from './src/services/recipeService.js';
import { parse } from 'csv-parse';

// Load environment variables
dotenv.config();

// ES Module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize express app
const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files
app.use('/assets', express.static(path.join(__dirname, 'src/assets')));
// Also serve the assets directory directly for better compatibility
app.use('/src/assets', express.static(path.join(__dirname, 'src/assets')));

// Specific route for recipes CSV to ensure it's accessible
app.get('/assets/csv/recipes_rows.csv', (req, res) => {
  // Try multiple possible paths for the CSV file
  const possiblePaths = [
    path.join(__dirname, 'src/assets/csv/recipes_rows.csv'),
    path.join(process.cwd(), 'src/assets/csv/recipes_rows.csv'),
    path.join(__dirname, 'recipes.csv'),
    path.join(process.cwd(), 'recipes.csv')
  ];
  
  console.log('Attempting to serve recipes CSV...');
  
  // Try each path until we find one that works
  for (const csvPath of possiblePaths) {
    console.log('Checking path:', csvPath);
    if (fs.existsSync(csvPath)) {
      console.log('Found CSV file at:', csvPath);
      res.setHeader('Content-Type', 'text/csv');
      return res.sendFile(csvPath);
    }
  }
  
  // If we get here, we couldn't find the file
  console.error('CSV file not found in any of the expected locations');
  res.status(404).send('CSV file not found');
});

// Direct route for the root recipes.csv file
app.get('/recipes.csv', (req, res) => {
  const csvPath = path.join(__dirname, 'recipes.csv');
  
  console.log('Attempting to serve root recipes.csv file...');
  
  if (fs.existsSync(csvPath)) {
    console.log('Found recipes.csv file at:', csvPath);
    res.setHeader('Content-Type', 'text/csv');
    return res.sendFile(csvPath);
  }
  
  console.error('recipes.csv file not found at root level');
  res.status(404).send('recipes.csv file not found');
});

// Check recipe service connection
let isConnected = false;
const initializeDB = async () => {
  try {
    // Test if we can load recipes from the service
    const testRecipes = await recipeService.getAllRecipes();
    isConnected = testRecipes && testRecipes.length > 0;
    
    if (isConnected) {
      console.log('Recipe service initialized successfully');
    } else {
      console.log('Recipe service failed to initialize');
    }
  } catch (error) {
    console.error('Recipe Service Error:', error.message);
    isConnected = false;
  }
};

// Initialize database connection
initializeDB();

// API Routes

// Get all recipes
app.get('/api/recipes', async (req, res) => {
  console.log('GET /api/recipes endpoint called');
  try {
    const recipes = await recipeService.getAllRecipes();
    console.log(`Returning ${recipes.length} recipes`);
    res.json(recipes);
  } catch (error) {
    console.error('Error fetching recipes:', error);
    // Import mock recipes directly as a fallback
    try {
      const { mockRecipes } = await import('./src/mockData/recipes.js');
      console.log(`Falling back to ${mockRecipes.length} mock recipes`);
      res.json(mockRecipes);
    } catch (mockError) {
      console.error('Error loading mock recipes:', mockError);
      res.status(500).json({ message: 'Could not load recipes or fallback data' });
    }
  }
});

// Match recipes based on ingredients and cookware
app.post('/api/recipes/match', async (req, res) => {
  try {
    const { ingredients, cookware } = req.body;
    
    if ((!ingredients || ingredients.length === 0) && (!cookware || cookware.length === 0)) {
      // Return all recipes instead of an empty array
      const allRecipes = await recipeService.getAllRecipes();
      return res.json(allRecipes);
    }
    
    const matchedRecipes = await recipeService.matchRecipes(ingredients, cookware);
    res.json(matchedRecipes);
  } catch (error) {
    console.error('Error matching recipes:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single recipe by ID
app.get('/api/recipes/:id', async (req, res) => {
  try {
    const recipe = await recipeService.getRecipeById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    
    res.json(recipe);
  } catch (error) {
    console.error('Error fetching recipe:', error);
    res.status(500).json({ message: error.message });
  }
});

// Import recipes from CSV
app.post('/api/import-recipes', async (req, res) => {
  try {
    // Get the CSV content from the request
    let csvContent = req.body.csvContent;
    
    // Clean up the CSV content (remove any npm commands that might be at the beginning)
    csvContent = csvContent.replace(/^npm.*\n/g, '');
    
    // Clean up headers (remove carriage returns)
    csvContent = csvContent.replace(/\r/g, '');
    
    // Parse the CSV content
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true
    });
    
    console.log(`Parsed ${records.length} recipes from CSV`);
    
    // Process each recipe
    const processedRecipes = records.map(record => {
      // Process arrays (convert comma-separated strings to arrays)
      const ingredients = record.ingredients ? record.ingredients.split(',').map(item => item.trim()) : [];
      const steps = record.steps ? record.steps.split(',').map(item => item.trim()) : [];
      const required_cookware = record.required_cookware ? record.required_cookware.split(',').map(item => item.trim()) : [];
      const protein_tags = record.protein_tags ? record.protein_tags.split(',').map(item => item.trim()) : [];
      const veggie_tags = record.veggie_tags ? record.veggie_tags.split(',').map(item => item.trim()) : [];
      const herb_tags = record.herb_tags ? record.herb_tags.split(',').map(item => item.trim()) : [];
      
      // Generate detailed three-level tags based on existing tags
      const detailedTags = generateDetailedTags(protein_tags, veggie_tags, herb_tags, ingredients, required_cookware);
      
      // Create the recipe object with all fields
      return {
        name: record.name || record.title || '',
        description: record.description || '',
        image_url: record.image_url || record.image || '',
        ingredients,
        steps,
        cook_time: record.cook_time || '',
        prep_time: record.prep_time || '',
        servings: record.servings || '',
        required_cookware,
        protein_tags,
        veggie_tags,
        herb_tags,
        cuisine_type: record.cuisine_type || '',
        // Add the detailed tags
        ...detailedTags
      };
    });
    
    // Import the recipes into the service
    const { data, error } = await recipeService.importRecipes(processedRecipes);
    
    if (error) {
      console.error('Error importing recipes:', error);
      return res.status(500).json({ error: 'Failed to import recipes' });
    }
    
    res.json({ message: `Successfully imported ${processedRecipes.length} recipes`, data });
  } catch (error) {
    console.error('Error in /api/import-recipes:', error);
    res.status(500).json({ error: 'Failed to import recipes' });
  }
});

/**
 * Generate detailed three-level tags based on existing tags and ingredients
 * @param {Array} proteinTags Array of protein tags
 * @param {Array} veggieTags Array of veggie tags
 * @param {Array} herbTags Array of herb tags
 * @param {Array} ingredients Array of ingredients
 * @param {Array} requiredCookware Array of required cookware
 * @returns {Object} Object with detailed tag arrays
 */
function generateDetailedTags(proteinTags = [], veggieTags = [], herbTags = [], ingredients = [], requiredCookware = []) {
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
      pots: ['stock', 'sauce', 'dutch', 'pressure', 'slow', 'multi'],
      pans: ['frying', 'saute', 'grill', 'griddle', 'wok', 'crepe'],
      bakeware: ['sheet', 'cake', 'muffin', 'loaf', 'casserole', 'pie'],
      utensils: ['spatula', 'whisk', 'tongs', 'ladle', 'spoon', 'turner'],
      appliances: ['blender', 'mixer', 'processor', 'toaster', 'microwave', 'airfryer'],
      knives: ['chef', 'paring', 'bread', 'utility', 'santoku', 'cleaver']
    }
  };
  
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
    cookware_variety: []
  };
  
  // Helper function to check if an ingredient contains a specific term
  function ingredientContains(ingredient, term) {
    return ingredient.toLowerCase().includes(term.toLowerCase());
  }
  
  // Process protein tags
  if (Array.isArray(proteinTags)) {
    proteinTags.forEach(tag => {
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
  if (Array.isArray(veggieTags)) {
    veggieTags.forEach(tag => {
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
  
  // Process ingredients for additional tags
  if (Array.isArray(ingredients)) {
    ingredients.forEach(ingredient => {
      // Check all categories
      for (const [category, types] of Object.entries(tagStructure)) {
        for (const [type, varieties] of Object.entries(types)) {
          for (const variety of varieties) {
            if (ingredientContains(ingredient, variety)) {
              // Add tags based on the category
              if (category === 'protein') {
                if (!detailedTags.protein_category.includes('protein')) {
                  detailedTags.protein_category.push('protein');
                }
                if (!detailedTags.protein_type.includes(type)) {
                  detailedTags.protein_type.push(type);
                }
                if (!detailedTags.protein_cut.includes(variety)) {
                  detailedTags.protein_cut.push(variety);
                }
              } else if (category === 'veggies') {
                if (!detailedTags.veggie_category.includes('veggies')) {
                  detailedTags.veggie_category.push('veggies');
                }
                if (!detailedTags.veggie_type.includes(type)) {
                  detailedTags.veggie_type.push(type);
                }
                if (!detailedTags.veggie_variety.includes(variety)) {
                  detailedTags.veggie_variety.push(variety);
                }
              } else if (category === 'pantry') {
                if (!detailedTags.pantry_category.includes('pantry')) {
                  detailedTags.pantry_category.push('pantry');
                }
                if (!detailedTags.pantry_type.includes(type)) {
                  detailedTags.pantry_type.push(type);
                }
                if (!detailedTags.pantry_variety.includes(variety)) {
                  detailedTags.pantry_variety.push(variety);
                }
              } else if (category === 'dairy') {
                if (!detailedTags.dairy_category.includes('dairy')) {
                  detailedTags.dairy_category.push('dairy');
                }
                if (!detailedTags.dairy_type.includes(type)) {
                  detailedTags.dairy_type.push(type);
                }
                if (!detailedTags.dairy_variety.includes(variety)) {
                  detailedTags.dairy_variety.push(variety);
                }
              } else if (category === 'fruit') {
                if (!detailedTags.fruit_category.includes('fruit')) {
                  detailedTags.fruit_category.push('fruit');
                }
                if (!detailedTags.fruit_type.includes(type)) {
                  detailedTags.fruit_type.push(type);
                }
                if (!detailedTags.fruit_variety.includes(variety)) {
                  detailedTags.fruit_variety.push(variety);
                }
              } else if (category === 'cookware') {
                if (!detailedTags.cookware_category.includes('cookware')) {
                  detailedTags.cookware_category.push('cookware');
                }
                if (!detailedTags.cookware_type.includes(type)) {
                  detailedTags.cookware_type.push(type);
                }
                if (!detailedTags.cookware_variety.includes(variety)) {
                  detailedTags.cookware_variety.push(variety);
                }
              }
              break;
            }
          }
        }
      }
    });
  }
  
  // Process required cookware
  if (Array.isArray(requiredCookware)) {
    requiredCookware.forEach(cookware => {
      // Check cookware categories
      for (const [type, varieties] of Object.entries(tagStructure.cookware)) {
        if (ingredientContains(cookware, type)) {
          if (!detailedTags.cookware_category.includes('cookware')) {
            detailedTags.cookware_category.push('cookware');
          }
          if (!detailedTags.cookware_type.includes(type)) {
            detailedTags.cookware_type.push(type);
          }
          
          // Determine cookware variety
          for (const variety of varieties) {
            if (ingredientContains(cookware, variety)) {
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
  
  return detailedTags;
}

// Start the server
app.listen(PORT, () => {
  console.log(`API Server running on port ${PORT}`);
});
